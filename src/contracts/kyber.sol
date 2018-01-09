pragma solidity ^0.4.18;

interface ExpectedRateInterface {
    function getExpectedRate(ERC20 source, ERC20 dest, uint srcQty) public view
        returns (uint expectedPrice, uint slippagePrice);
}

interface ERC20 {
    function totalSupply() public view returns (uint supply);
    function balanceOf(address _owner) public view returns (uint balance);
    function transfer(address _to, uint _value) public returns (bool success);
    function transferFrom(address _from, address _to, uint _value) public returns (bool success);
    function approve(address _spender, uint _value) public returns (bool success);
    function allowance(address _owner, address _spender) public view returns (uint remaining);
    function decimals() public view returns(uint digits);
    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}

interface SanityPricingInterface {
    function getSanityPrice(ERC20 src, ERC20 dest) view public returns(uint);
}

contract KyberConstants {

    ERC20 constant ETH_TOKEN_ADDRESS = ERC20(0x00eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee);
    uint  constant PRECISION = (10**18);
    uint  constant MAX_QTY   = (10**28); // 1B tokens
    uint  constant MAX_RATE  = (PRECISION * 10**6); // up to 1M tokens per ETH
    uint  constant MAX_DECIMALS = 18;
}

interface FeeBurnerInterface {
    function handleFees (uint tradeWeiAmount, address reserve, address wallet) public returns(bool);
}

contract PermissionGroups {

    address public admin;
    address public pendingAdmin;
    mapping(address=>bool) operators;
    mapping(address=>bool) alerters;
    address[] operatorsGroup;
    address[] alertersGroup;

    function PermissionGroups() public {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require (msg.sender == admin);
        _;
    }

    modifier onlyOperator() {
        require (operators[msg.sender]);
        _;
    }

    modifier onlyAlerter() {
        require (alerters[msg.sender]);
        _;
    }

    event TransferAdmin(address pendingAdmin);

    /**
     * @dev Allows the current admin to set the pendingAdmin address.
     * @param newAdmin The address to transfer ownership to.
     */
    function transferAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin !=  address(0));
        TransferAdmin(pendingAdmin);
        pendingAdmin = newAdmin;
    }

    event ClaimAdmin( address newAdmin, address previousAdmin);

    /**
     * @dev Allows the pendingAdmin address to finalize the change admin process.
     */
    function claimAdmin() public {
        require(pendingAdmin == msg.sender);
        ClaimAdmin(pendingAdmin, admin);
        admin = pendingAdmin;
        pendingAdmin = address(0);
    }

    event AddAlerter (address newAlerter, bool isAdd);

    function addAlerter(address newAlerter) public onlyAdmin {
        require(!alerters[newAlerter]); // prevent duplicates.
        AddAlerter(newAlerter, true);
        alerters[newAlerter] = true;
        alertersGroup.push(newAlerter);
    }

    function removeAlerter (address alerter) public onlyAdmin {

        require(alerters[alerter]);
        alerters[alerter] = false;

        for (uint i = 0; i < alertersGroup.length; ++i)
        {
            if (alertersGroup[i] == alerter)
            {
                alertersGroup[i] = alertersGroup[alertersGroup.length - 1];
                alertersGroup.length--;
                AddAlerter(alerter, false);
                break;
            }
        }
    }

    event AddOperator(address newOperator, bool isAdd);

    function addOperator(address newOperator) public onlyAdmin {
        require(!operators[newOperator]); // prevent duplicates.
        AddOperator(newOperator, true);
        operators[newOperator] = true;
        operatorsGroup.push(newOperator);
    }

    function removeOperator (address operator) public onlyAdmin {

        require (operators[operator]);
        operators[operator] = false;

        for (uint i = 0; i < operatorsGroup.length; ++i)
        {
            if (operatorsGroup[i] == operator)
            {
                operatorsGroup[i] = operatorsGroup[operatorsGroup.length - 1];
                operatorsGroup.length -= 1;
                AddOperator(operator, false);
                break;
            }
        }
    }

    function getOperators () external view returns(address []) {
        return operatorsGroup;
    }

    function getAlerters () external view returns(address []) {
        return alertersGroup;
    }
}

contract Withdrawable is PermissionGroups {

    event WithdrawToken(ERC20 token, uint amount, address sendTo);
    /**
     * @dev Withdraw all ERC20 compatible tokens
     * @param token ERC20 The address of the token contract
     */
    function withdrawToken(ERC20 token, uint amount, address sendTo) external onlyAdmin {
        assert(token.transfer(sendTo, amount));
        WithdrawToken(token, amount, sendTo);
    }

    event WithdrawEther(uint amount, address sendTo);
    /**
     * @dev Withdraw Ethers
     */
    function withdrawEther(uint amount, address sendTo) external onlyAdmin {
        sendTo.transfer(amount);
        WithdrawEther(amount, sendTo);
    }
}

contract KyberNetwork is Withdrawable, KyberConstants {

    uint public negligiblePriceDiff = 10; // basic price steps will be in 0.01%
    KyberReserve[] public reserves;
    mapping(address=>bool) public isReserve;
    KyberWhiteList public kyberWhiteList;
    ExpectedRateInterface public expectedRateContract;
    FeeBurnerInterface    public feeBurnerContract;
    uint                  public maxGasPrice = 50 * 1000 * 1000 * 1000; // 50 gwei
    bool                  public enable = true; // network is enabled
    mapping(address=>mapping(bytes32=>bool)) perReserveListedPairs;

    function KyberNetwork(address _admin) public {
        admin = _admin;
    }

    event Trade(address indexed sender, ERC20 source, ERC20 dest, uint actualSrcAmount, uint actualDestAmount);

    /// @notice use token address ETH_TOKEN_ADDRESS for ether
    /// @dev makes a trade between source and dest token and send dest token to
    /// destAddress and record wallet id for later payment
    /// @param source Source token
    /// @param srcAmount amount of source tokens
    /// @param dest   Destination token
    /// @param destAddress Address to send tokens to
    /// @param maxDestAmount A limit on the amount of dest tokens
    /// @param minConversionRate The minimal conversion rate. If actual rate is lower, trade is canceled.
    /// @return amount of actual dest tokens
    function walletTrade(
        ERC20 source,
        uint srcAmount,
        ERC20 dest,
        address destAddress,
        uint maxDestAmount,
        uint minConversionRate,
        address walletId
    )
        public
        payable
        returns(uint)
    {
       return trade(source, srcAmount, dest, destAddress, maxDestAmount, minConversionRate, walletId);
    }

    /// @notice use token address ETH_TOKEN_ADDRESS for ether
    /// @dev makes a trade between source and dest token and send dest token to destAddress
    /// @param source Source token
    /// @param srcAmount amount of source tokens
    /// @param dest   Destination token
    /// @param destAddress Address to send tokens to
    /// @param maxDestAmount A limit on the amount of dest tokens
    /// @param minConversionRate The minimal conversion rate. If actual rate is lower, trade is canceled.
    /// @return amount of actual dest tokens
    function trade(
        ERC20 source,
        uint srcAmount,
        ERC20 dest,
        address destAddress,
        uint maxDestAmount,
        uint minConversionRate,
        address walletId
    )
        public
        payable
        returns(uint)
    {
        require(enable);

        uint userSrcBalanceBefore;
        uint userSrcBalanceAfter;
        uint userDestBalanceBefore;
        uint userDestBalanceAfter;

        userSrcBalanceBefore = getBalance(source, msg.sender);
        userDestBalanceBefore = getBalance(dest,destAddress);

        assert(doTrade(source,srcAmount,dest,destAddress,maxDestAmount,minConversionRate,walletId) > 0);

        userSrcBalanceAfter = getBalance(source, msg.sender);
        userDestBalanceAfter = getBalance(dest,destAddress);

        require(userSrcBalanceAfter <= userSrcBalanceBefore);
        require(userDestBalanceAfter >= userDestBalanceBefore);

        uint srcDecimals;
        uint destDecimals;

        if(source == ETH_TOKEN_ADDRESS) {
            srcDecimals = 18;
        } else {
            srcDecimals = source.decimals();
        }

        if(dest == ETH_TOKEN_ADDRESS) {
            destDecimals = 18;
        } else {
            destDecimals = dest.decimals();
        }

        // TODO - mitigate potential overflow
        require(((userSrcBalanceBefore - userSrcBalanceAfter) * minConversionRate) * (10 ** destDecimals) <=
                (userDestBalanceAfter - userDestBalanceBefore) * (10 ** srcDecimals) * PRECISION );
    }

    function doTrade(
        ERC20 source,
        uint srcAmount,
        ERC20 dest,
        address destAddress,
        uint maxDestAmount,
        uint minConversionRate,
        address walletId
    )
        internal
        returns(uint)
    {
        require(tx.gasprice <= maxGasPrice);
        require(kyberWhiteList != address(0));
        require(feeBurnerContract != address(0));
        require(validateTradeInput(source, srcAmount));

        uint reserveInd;
        uint rate;
        (reserveInd,rate) = findBestRate(source, dest, srcAmount);
        KyberReserve theReserve = reserves[reserveInd];
        assert(rate > 0);
        assert(rate < MAX_RATE);
        assert(rate >= minConversionRate);

        uint actualSourceAmount = srcAmount;
        uint actualDestAmount = theReserve.getDestQty(source, dest, actualSourceAmount, rate);

        if(actualDestAmount > maxDestAmount) {
            actualDestAmount = maxDestAmount;
            actualSourceAmount = theReserve.getSrcQty(source, dest, actualDestAmount, rate);
        }

        // do the trade
        // verify trade size is smaller then user cap
        uint ethAmount;
        if (source == ETH_TOKEN_ADDRESS) {
            ethAmount = actualSourceAmount;
        }
        else {
            ethAmount = actualDestAmount;
        }

        require(ethAmount <= getUserCapInWei(msg.sender));

        assert(doReserveTrade(
            source,
            actualSourceAmount,
            dest,
            destAddress,
            actualDestAmount,
            theReserve,
            rate,
            true)
        );

        assert(feeBurnerContract.handleFees(ethAmount,theReserve,walletId));

        Trade(msg.sender, source, dest, actualSourceAmount, actualDestAmount);
        return actualDestAmount;
    }

    event AddReserve(KyberReserve reserve, bool add);

    /// @notice can be called only by admin
    /// @dev add or deletes a reserve to/from the network.
    /// @param reserve The reserve address.
    /// @param add If true, the add reserve. Otherwise delete reserve.
    function addReserve(KyberReserve reserve, bool add) public onlyAdmin {

        if(add) {
            reserves.push(reserve);
            isReserve[reserve] = true;
            AddReserve(reserve, true);
        } else {
            isReserve[reserve] = false;
            // will have trouble if more than 50k reserves...
            for(uint i = 0; i < reserves.length; i++) {
                if(reserves[i] == reserve) {
                    if(reserves.length == 0) return;
                    reserves[i] = reserves[--reserves.length];
                    AddReserve(reserve, false);
                    break;
                }
            }
        }
    }

    event ListPairsForReserve(address reserve, ERC20 source, ERC20 dest, bool add);

    /// @notice can be called only by admin
    /// @dev allow or prevent a specific reserve to trade a pair of tokens
    /// @param reserve The reserve address.
    /// @param source Source token
    /// @param dest Destination token
    /// @param add If true then enable trade, otherwise delist pair.
    function listPairForReserve(address reserve, ERC20 source, ERC20 dest, bool add) public onlyAdmin {
        (perReserveListedPairs[reserve])[keccak256(source, dest)] = add;

        if(source != ETH_TOKEN_ADDRESS) {
            if(add) {
                source.approve(reserve, 2**255); // approve infinity
            } else {
                source.approve(reserve, 0);
            }
        }

        ListPairsForReserve(reserve, source, dest, add);
    }

    function setParams(
        KyberWhiteList        _whiteList,
        ExpectedRateInterface _expectedRate,
        FeeBurnerInterface    _feeBurner,
        uint                  _maxGasPrice,
        uint                  _negligibleDiff
    )
        public
        onlyAdmin
    {
        kyberWhiteList = _whiteList;
        expectedRateContract = _expectedRate;
        feeBurnerContract = _feeBurner;
        maxGasPrice = _maxGasPrice;
        negligiblePriceDiff = _negligibleDiff;

    }

    function setEnable(bool _enable) public onlyAdmin {
        enable = _enable;
    }

    event EtherRecival(address indexed sender, uint amount);
    function() payable public {
        require(isReserve[msg.sender]);
        EtherRecival(msg.sender,msg.value);
    }

    /// @dev returns number of reserves
    /// @return number of reserves
    function getNumReserves() public view returns(uint) {
        return reserves.length;
    }

    /// @notice should be called off chain with as much gas as needed
    /// @dev get an array of all reserves
    /// @return An array of all reserves
    function getReserves() public view returns(KyberReserve[]) {
        return reserves;
    }

    /// @dev get the balance of a user.
    /// @param token The token type
    /// @return The balance
    function getBalance(ERC20 token, address user) public view returns(uint){
        if(token == ETH_TOKEN_ADDRESS) return user.balance;
        else return token.balanceOf(user);
    }

    /// @notice use token address ETH_TOKEN_ADDRESS for ether
    /// @dev best conversion rate for a pair of tokens, if number of reserves have small differences. randomize
    /// @param source Source token
    /// @param dest Destination token
    function findBestRate(ERC20 source, ERC20 dest, uint srcQty) public view returns(uint, uint) {
        uint bestRate = 0;
        uint bestReserve = 0;
        uint numRelevantReserves = 0;
        uint numReserves = reserves.length;
        uint[] memory rates = new uint[](numReserves);
        uint[] memory reserveCandidates = new uint[](numReserves);

        for(uint i = 0; i < numReserves; i++) {
            //list all reserves that have this token.
            if(!(perReserveListedPairs[reserves[i]])[keccak256(source, dest)]) continue;

            rates[i] = reserves[i].getConversionRate(source, dest, srcQty, block.number);

            if(rates[i] > bestRate) {
                //best rate is highest rate
                bestRate = rates[i];
            }
        }

        if (bestRate > 0) {
            uint random = 0;
            uint smallestRelevantRate = (bestRate * 10000) / (10000 + negligiblePriceDiff);

            for (i = 0; i < numReserves; i++) {
                if (rates[i] >= smallestRelevantRate) {
                    reserveCandidates[numRelevantReserves++] = i;
                }
            }

            if (numRelevantReserves > 1) {
                //when encountering small price diff from bestRate. draw from relevant reserves
                random = uint(block.blockhash(block.number-1)) % numRelevantReserves;
            }

            bestReserve = reserveCandidates[random];
            bestRate = rates[bestReserve];
        }

        return (bestReserve, bestRate);
    }

    function getExpectedRate(ERC20 source, ERC20 dest, uint srcQuantity)
        public view
        returns (uint expectedPrice, uint slippagePrice)
    {
        require(expectedRateContract != address(0));
        return expectedRateContract.getExpectedRate(source, dest, srcQuantity);
    }

    function getUserCapInWei(address user) public view returns(uint) {
        return kyberWhiteList.getUserCapInWei(user);
    }

    /// @notice use token address ETH_TOKEN_ADDRESS for ether
    /// @dev do one trade with a reserve
    /// @param source Source token
    /// @param amount amount of source tokens
    /// @param dest   Destination token
    /// @param destAddress Address to send tokens to
    /// @param reserve Reserve to use
    /// @param validate If true, additional validations are applicable
    /// @return true if trade is successful
    function doReserveTrade(
        ERC20 source,
        uint amount,
        ERC20 dest,
        address destAddress,
        uint expectedDestAmount,
        KyberReserve reserve,
        uint conversionRate,
        bool validate
    )
        internal
        returns(bool)
    {
        uint callValue = 0;

        if(source == ETH_TOKEN_ADDRESS) {
            callValue = amount;
        } else {
            // take source tokens to this contract
            source.transferFrom(msg.sender, this, amount);
        }

        // reserve send tokens/eth to network. network sends it to destination
        assert(reserve.trade.value(callValue)(source, amount, dest, this, conversionRate, validate));

        if(dest == ETH_TOKEN_ADDRESS) {
            destAddress.transfer(expectedDestAmount);
        } else {
            assert(dest.transfer(destAddress,expectedDestAmount));
        }

        return true;
    }

    /// @notice use token address ETH_TOKEN_ADDRESS for ether
    /// @dev checks that user sent ether/tokens to contract before trade
    /// @param source Source token
    /// @param srcAmount amount of source tokens
    /// @return true if input is valid
    function validateTradeInput(ERC20 source, uint srcAmount) internal view returns(bool) {
        require(srcAmount < MAX_QTY );
        if(source == ETH_TOKEN_ADDRESS) {
            require (msg.value == srcAmount);
        } else {
            require (msg.value == 0);
            require (source.allowance(msg.sender,this) >= srcAmount);
        }

        return true;
    }
}

contract FeeBurner is Withdrawable, FeeBurnerInterface {

    mapping(address=>uint) public reserveFeesInBps;
    mapping(address=>address) public reserveKNCWallet;
    mapping(address=>uint) public walletFeesInBps;

    mapping(address=>uint) public reserveFeeToBurn;
    mapping(address=>mapping(address=>uint)) public reserveFeeToWallet;

    BurnableToken public KNC;
    address public kyberNetwork;
    uint public KNCPerETHRate = 300;

    function FeeBurner(address _admin, BurnableToken KNCToken) public {
        admin = _admin;
        KNC = KNCToken;
    }

    function setReserveData(address reserve, uint feesInBps, address kncWallet) public onlyAdmin {
        require(feesInBps < 100); // make sure it is always < 1%
        reserveFeesInBps[reserve] = feesInBps;
        reserveKNCWallet[reserve] = kncWallet;
    }

    function setWalletFees(address wallet, uint feesInBps) public onlyAdmin {
        require(feesInBps < 10000); // under 100%
        walletFeesInBps[wallet] = feesInBps;
    }

    function setKyberNetwork(address network) public onlyAdmin {
        kyberNetwork = network;
    }

    function setKNCRate(uint rate) public onlyAdmin {
        KNCPerETHRate = rate;
    }

    event AssignFeeToWallet(address reserve, address wallet, uint walletFee);
    event BurnFees(address reserve, uint burnFee);

    function handleFees(uint tradeWeiAmount, address reserve, address wallet) public returns(bool) {
        require(msg.sender == kyberNetwork);

        uint kncAmount = tradeWeiAmount * KNCPerETHRate;
        uint fee = kncAmount * reserveFeesInBps[reserve] / 10000;

        uint walletFee = fee * walletFeesInBps[wallet] / 10000;
        assert(fee >= walletFee);
        uint feeToBurn = fee - walletFee;

        if(walletFee > 0) {
            reserveFeeToWallet[reserve][wallet] += walletFee;
            AssignFeeToWallet(reserve, wallet, walletFee);
        }

        if(feeToBurn > 0) {
            BurnFees(reserve, feeToBurn);
            reserveFeeToBurn[reserve] += feeToBurn;

        }

        return true;
    }

    // this function is callable by anyone
    event BurnReserveFees(address indexed reserve, address sender);
    function burnReserveFees(address reserve) public {
        uint burnAmount = reserveFeeToBurn[reserve];
        require(burnAmount > 0);
        reserveFeeToBurn[reserve] = 1; // leave 1 twei to avoid spikes in gas fee
        KNC.burnFrom(reserveKNCWallet[reserve],burnAmount - 1);

        BurnReserveFees(reserve, msg.sender);
    }

    event SendFeeToWallet(address indexed wallet, address reserve, address sender);
    // this function is callable by anyone
    function sendFeeToWallet(address wallet, address reserve) public {
        uint feeAmount = reserveFeeToWallet[reserve][wallet];
        require(feeAmount > 0);
        reserveFeeToWallet[reserve][wallet] = 1; // leave 1 twei to avoid spikes in gas fee
        KNC.transferFrom(reserveKNCWallet[reserve],wallet,feeAmount - 1);

        SendFeeToWallet(wallet,reserve,msg.sender);
    }
}

contract KyberReserve is Withdrawable, KyberConstants {

    address public kyberNetwork;
    bool public tradeEnabled;
    Pricing public pricingContract;
    SanityPricingInterface public sanityPricingContract;
    mapping(bytes32=>bool) public approvedWithdrawAddresses; // sha3(token,address)=>bool

    function KyberReserve(address _kyberNetwork, Pricing _pricingContract, address _admin) public {
        kyberNetwork = _kyberNetwork;
        pricingContract = _pricingContract;
        admin = _admin;
        tradeEnabled = true;
    }

    event DepositToken(ERC20 token, uint amount);

    function() payable public {
        DepositToken(ETH_TOKEN_ADDRESS, msg.value);
    }

    event DoTrade(
        address indexed origin,
        address source,
        uint sourceAmount,
        address destToken,
        uint destAmount,
        address destAddress
    );

    function trade(
        ERC20 sourceToken,
        uint sourceAmount,
        ERC20 destToken,
        address destAddress,
        uint conversionRate,
        bool validate
    )
        public
        payable
        returns(bool)
    {
        require(tradeEnabled);
        require(msg.sender == kyberNetwork);

        assert(doTrade(sourceToken, sourceAmount, destToken, destAddress, conversionRate, validate));

        return true;
    }

    event EnableTrade(bool enable);

    function enableTrade() public onlyAdmin returns(bool) {
        tradeEnabled = true;
        EnableTrade(true);

        return true;
    }

    function disableTrade() public onlyAlerter returns(bool) {
        tradeEnabled = false;
        EnableTrade(false);

        return true;
    }

    event ApproveWithdrawAddress(ERC20 token, address addr, bool approve);

    function approveWithdrawAddress(ERC20 token, address addr, bool approve) public onlyAdmin {
        approvedWithdrawAddresses[keccak256(token, addr)] = approve;
        ApproveWithdrawAddress(token, addr, approve);
    }

    event Withdraw(ERC20 token, uint amount, address destination);

    function withdraw(ERC20 token, uint amount, address destination) public onlyOperator returns(bool) {
        require(approvedWithdrawAddresses[keccak256(token, destination)]);

        if(token == ETH_TOKEN_ADDRESS) {
            destination.transfer(amount);
        } else {
            assert(token.transfer(destination, amount));
        }

        Withdraw(token, amount, destination);

        return true;
    }

    function setContracts(address _kyberNetwork, Pricing _pricing, SanityPricingInterface _sanityPricing)
        public
        onlyAdmin
    {
        require(_kyberNetwork != address(0));
        require(_pricing != address(0));

        kyberNetwork = _kyberNetwork;
        pricingContract = _pricing;
        sanityPricingContract = _sanityPricing;
    }

    ////////////////////////////////////////////////////////////////////////////
    /// status functions ///////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    function getBalance(ERC20 token) public view returns(uint) {
        if(token == ETH_TOKEN_ADDRESS) return this.balance;
        else return token.balanceOf(this);
    }

    function getDecimals(ERC20 token) public view returns(uint) {
        if(token == ETH_TOKEN_ADDRESS) return 18;
        return token.decimals();
    }

    function getDestQty(ERC20 source, ERC20 dest, uint srcQty, uint rate) public view returns(uint) {
        uint dstDecimals = getDecimals(dest);
        uint srcDecimals = getDecimals(source);

        if( dstDecimals >= srcDecimals ) {
            require((dstDecimals-srcDecimals) <= MAX_DECIMALS);
            return (srcQty * rate * (10**(dstDecimals-srcDecimals))) / PRECISION;
        } else {
            require((srcDecimals-dstDecimals) <= MAX_DECIMALS);
            return (srcQty * rate) / (PRECISION * (10**(srcDecimals-dstDecimals)));
        }
    }

    function getSrcQty(ERC20 source, ERC20 dest, uint dstQty, uint rate) public view returns(uint) {
        uint dstDecimals = getDecimals(dest);
        uint srcDecimals = getDecimals(source);

        if( srcDecimals >= dstDecimals ) {
            require((srcDecimals-dstDecimals) <= MAX_DECIMALS);
            return (PRECISION * dstQty * (10**(srcDecimals - dstDecimals))) / rate;
        } else {
            require((dstDecimals-srcDecimals) <= MAX_DECIMALS);
            return (PRECISION * dstQty) / (rate * (10**(dstDecimals - srcDecimals)));
        }
    }

    function getConversionRate(ERC20 source, ERC20 dest, uint srcQty, uint blockNumber) public view returns(uint) {
        ERC20 token;
        bool  buy;
        uint  tokenQty;

        if(ETH_TOKEN_ADDRESS == source) {
            buy = true;
            token = dest;
            tokenQty = getDestQty(source, dest, srcQty, pricingContract.getBasicPrice(token,true));
        } else if(ETH_TOKEN_ADDRESS == dest) {
            buy = false;
            token = source;
            tokenQty = srcQty;
        } else {
            return 0; // pair is not listed
        }

        uint price = pricingContract.getPrice(token, blockNumber, buy, tokenQty);
        uint destQty = getDestQty(source, dest, srcQty, price);

        if(getBalance(dest) < destQty) return 0;

        if(sanityPricingContract != address(0)) {
            uint sanityPrice = sanityPricingContract.getSanityPrice(source, dest);
            if(price > sanityPrice) return 0;
        }

        return price;
    }

    /// @dev do a trade
    /// @param sourceToken Source token
    /// @param sourceAmount Amount of source token
    /// @param destToken Destination token
    /// @param destAddress Destination address to send tokens to
    /// @param validate If true, additional validations are applicable
    /// @return true iff trade is successful
    function doTrade(
        ERC20 sourceToken,
        uint sourceAmount,
        ERC20 destToken,
        address destAddress,
        uint conversionRate,
        bool validate
    )
        internal
        returns(bool)
    {
        // can skip validation if done at kyber network level
        if(validate) {
            require(conversionRate > 0);
            if(sourceToken == ETH_TOKEN_ADDRESS) require(msg.value == sourceAmount);
            else require(msg.value == 0);
        }

        uint destAmount = getDestQty(sourceToken, destToken, sourceAmount, conversionRate);
        // sanity check
        require(destAmount > 0);

        // add to imbalance
        ERC20 token;
        int buy;
        if(sourceToken == ETH_TOKEN_ADDRESS) {
            buy = int(destAmount);
            token = destToken;
        } else {
            buy = -1 * int(sourceAmount);
            token = sourceToken;
        }

        pricingContract.recordImbalance(
            token,
            buy,
            pricingContract.getPriceUpdateBlock(token),
            block.number
        );

        // collect source tokens
        if(sourceToken != ETH_TOKEN_ADDRESS) {
            assert(sourceToken.transferFrom(msg.sender,this,sourceAmount));
        }

        // send dest tokens
        if(destToken == ETH_TOKEN_ADDRESS) {
            destAddress.transfer(destAmount);
        } else {
            assert(destToken.transfer(destAddress, destAmount));
        }

        DoTrade(tx.origin, sourceToken, sourceAmount, destToken, destAmount, destAddress);

        return true;
    }
}

contract SanityPricing is SanityPricingInterface, Withdrawable {
    mapping(bytes32=>uint) prices;

    function SanityPricing(address _admin) public {
        admin = _admin;
    }

    function setSanityPrices(ERC20[] sources, ERC20[] dests, uint[] rates) public onlyOperator {
        require(sources.length == dests.length);
        require(dests.length == rates.length);

        for(uint i = 0; i < sources.length; i++) {
            prices[keccak256(sources[i], dests[i])] = rates[i];
        }
    }

    function getSanityPrice(ERC20 src, ERC20 dest) view public returns(uint) {
        return prices[keccak256(src, dest)];
    }
}

contract ExpectedRate is Withdrawable, ExpectedRateInterface {

    KyberNetwork kyberNetwork;
    uint quantityFactor = 2;

    function ExpectedRate(KyberNetwork _kyberNetwork, address _admin) public {
        kyberNetwork = _kyberNetwork;
        admin = _admin;
    }

    event SetQuantityFactor (uint newFactor, uint oldFactor, address sender);

    function setQuantityFactor(uint newFactor) public onlyOperator {
        SetQuantityFactor(quantityFactor, newFactor, msg.sender);
        quantityFactor = newFactor;
    }

    function getExpectedRate(ERC20 source, ERC20 dest, uint srcQty)
        public view
        returns (uint expectedPrice, uint slippagePrice)
    {
        require (quantityFactor != 0);
        require (kyberNetwork != address (0));

        uint bestReserve;

        (bestReserve, expectedPrice) = kyberNetwork.findBestRate(source, dest, srcQty);
        (bestReserve, slippagePrice) = kyberNetwork.findBestRate(source, dest, (srcQty * quantityFactor));

        return (expectedPrice, slippagePrice);
    }
}

contract VolumeImbalanceRecorder is Withdrawable {

    uint constant SLIDING_WINDOW_SIZE = 5;
    uint constant POW_2_64 = 2 ** 64;

    struct TokenControlInfo {
        uint minimalRecordResolution; // can be roughly 1 cent
        uint maxPerBlockImbalance; // in twei resolution
        uint maxTotalImbalance; // max total imbalance (without price updates)
                            // before halting trade
    }

    mapping(address => TokenControlInfo) tokenControlInfo;

    struct TokenImbalanceData {
        int64  lastBlockBuyUnitsImbalance;
        uint64 lastBlock;

        int64  totalBuyUnitsImbalance;
        uint64 lastPriceUpdateBlock;
    }

    mapping(address => mapping(uint=>uint)) tokenImbalanceData;

    function VolumeImbalanceRecorder(address _admin) public {
        admin = _admin;
    }

    function setTokenControlInfo(
        ERC20 token,
        uint minimalRecordResolution,
        uint maxPerBlockImbalance,
        uint maxTotalImbalance
    )
        public
        onlyAdmin
    {
        tokenControlInfo[token] =
            TokenControlInfo(
                minimalRecordResolution,
                maxPerBlockImbalance,
                maxTotalImbalance
            );
    }

    function getTokenControlInfo(ERC20 token) public view returns(uint, uint, uint) {
        return (tokenControlInfo[token].minimalRecordResolution,
                tokenControlInfo[token].maxPerBlockImbalance,
                tokenControlInfo[token].maxTotalImbalance);
    }

    function addImbalance(
        ERC20 token,
        int buyAmount,
        uint priceUpdateBlock,
        uint currentBlock
    )
        internal
    {
        uint currentBlockIndex = currentBlock % SLIDING_WINDOW_SIZE;
        int64 recordedBuyAmount = int64(buyAmount / int(tokenControlInfo[token].minimalRecordResolution));

        int prevImbalance = 0;

        TokenImbalanceData memory currentBlockData = decodeTokenImbalanceData(tokenImbalanceData[token][currentBlockIndex]);

        // first scenario - this is not the first tx in the current block
        if(currentBlockData.lastBlock == currentBlock) {
            if(uint(currentBlockData.lastPriceUpdateBlock) == priceUpdateBlock) {
                // just increase imbalance
                currentBlockData.lastBlockBuyUnitsImbalance += recordedBuyAmount;
                currentBlockData.totalBuyUnitsImbalance += recordedBuyAmount;
            } else {
                // imbalance was changed in the middle of the block
                prevImbalance = getImbalanceInRange(token, priceUpdateBlock, currentBlock);
                currentBlockData.totalBuyUnitsImbalance = int64(prevImbalance) + recordedBuyAmount;
                currentBlockData.lastBlockBuyUnitsImbalance += recordedBuyAmount;
                currentBlockData.lastPriceUpdateBlock = uint64(priceUpdateBlock);
            }
        } else {
            // first tx in the current block
            int currentBlockImbalance;
            (prevImbalance, currentBlockImbalance) = getImbalanceSincePriceUpdate(token, priceUpdateBlock, currentBlock);

            currentBlockData.lastBlockBuyUnitsImbalance = recordedBuyAmount;
            currentBlockData.lastBlock = uint64(currentBlock);
            currentBlockData.lastPriceUpdateBlock = uint64(priceUpdateBlock);
            currentBlockData.totalBuyUnitsImbalance = int64(prevImbalance) + recordedBuyAmount;
        }

        tokenImbalanceData[token][currentBlockIndex] = encodeTokenImbalanceData(currentBlockData);
    }

    function setGarbageToVolumeRecorder(ERC20 token) internal {
        for(uint i = 0 ; i < SLIDING_WINDOW_SIZE ; i++ ) {
            tokenImbalanceData[token][i] = 0x1;
        }
    }

    function getImbalanceInRange(ERC20 token, uint startBlock, uint endBlock) internal view returns(int buyImbalance) {
        // check the imbalance in the sliding window
        require(startBlock <= endBlock);

        buyImbalance = 0;

        for(uint windowInd = 0; windowInd < SLIDING_WINDOW_SIZE; windowInd++) {
            TokenImbalanceData memory perBlockData = decodeTokenImbalanceData(tokenImbalanceData[token][windowInd]);

            if(perBlockData.lastBlock <= endBlock && perBlockData.lastBlock >= startBlock) {
                buyImbalance += int(perBlockData.lastBlockBuyUnitsImbalance);
            }
        }
    }

    function getImbalanceSincePriceUpdate(ERC20 token, uint priceUpdateBlock, uint currentBlock)
        internal view
        returns(int buyImbalance, int currentBlockImbalance)
    {
        buyImbalance = 0;
        currentBlockImbalance = 0;
        uint64 latestBlock = uint64(0);

        for(uint windowInd = 0; windowInd < SLIDING_WINDOW_SIZE; windowInd++) {
            TokenImbalanceData memory perBlockData = decodeTokenImbalanceData(tokenImbalanceData[token][windowInd]);

            if(uint(perBlockData.lastPriceUpdateBlock) != priceUpdateBlock) continue;
            if(perBlockData.lastBlock < latestBlock) continue;

            latestBlock = perBlockData.lastBlock;
            buyImbalance = perBlockData.totalBuyUnitsImbalance;
            if(uint(perBlockData.lastBlock) == currentBlock) {
                currentBlockImbalance = perBlockData.lastBlockBuyUnitsImbalance;
            }
        }

        if(buyImbalance == 0) {
            buyImbalance = getImbalanceInRange(token, priceUpdateBlock, currentBlock);
        }
    }

    function getImbalance(ERC20 token, uint priceUpdateBlock, uint currentBlock)
        internal view
        returns(int totalImbalance, int currentBlockImbalance)
    {

        int resolution = int(tokenControlInfo[token].minimalRecordResolution);

        (totalImbalance,currentBlockImbalance) = getImbalanceSincePriceUpdate(token,
                                                                              priceUpdateBlock,
                                                                              currentBlock);
        totalImbalance *= resolution;
        currentBlockImbalance *= resolution;
    }

    function getMaxPerBlockImbalance(ERC20 token) internal view returns(uint) {
        return tokenControlInfo[token].maxPerBlockImbalance;
    }

    function getMaxTotalImbalance(ERC20 token) internal view returns(uint) {
        return tokenControlInfo[token].maxTotalImbalance;
    }

    function encodeTokenImbalanceData(TokenImbalanceData data) internal pure returns(uint)  {
        uint result = uint(data.lastBlockBuyUnitsImbalance) & (POW_2_64 - 1);
        result |= data.lastBlock * POW_2_64;
        result |= (uint(data.totalBuyUnitsImbalance) & (POW_2_64 - 1)) * POW_2_64 * POW_2_64;
        result |= data.lastPriceUpdateBlock * POW_2_64 * POW_2_64 * POW_2_64;

        return result;
    }

    function decodeTokenImbalanceData(uint input) internal pure returns(TokenImbalanceData) {
        TokenImbalanceData memory data;

        data.lastBlockBuyUnitsImbalance = int64(input & (POW_2_64 - 1));
        data.lastBlock = uint64((input / POW_2_64) & (POW_2_64 - 1));
        data.totalBuyUnitsImbalance = int64( (input / (POW_2_64 * POW_2_64)) & (POW_2_64 - 1) );
        data.lastPriceUpdateBlock = uint64( (input / (POW_2_64 * POW_2_64 * POW_2_64)) );

        return data;
    }
}

contract Pricing is VolumeImbalanceRecorder {

    // bps - basic price steps. one step is 1 / 10000 of the price.
    struct StepFunction {
        int[] x; // quantity for each step. Quantity of each step includes previous steps.
        int[] y; // price change per quantity step  in bps.
    }

    struct TokenData {
        bool listed;  // was added to reserve
        bool enabled; // whether trade is enabled

        // position in the compact data
        uint compactDataArrayIndex;
        uint compactDataFieldIndex;

        // price data. base and changes according to quantity and reserve balance.
        // generally speaking. Sell price is 1 / buy price i.e. the buy in the other direction.
        uint baseBuyPrice;  // in PRECISION units. see KyberConstants
        uint baseSellPrice; // PRECISION units. without (sell / buy) spread it is 1 / baseBuyPrice
        StepFunction buyPriceQtyStepFunction; // in bps. higher quantity - bigger the price.
        StepFunction sellPriceQtyStepFunction;// in bps. higher the qua
        StepFunction buyPriceImbalanceStepFunction; // in BPS. higher reserve imbalance - bigger the price.
        StepFunction sellPriceImbalanceStepFunction;
    }

    /*
    this is the data for tokenPricesCompactData
    but solidity compiler sucks, and cannot write this structure in a single storage write
    so we represent it as bytes32 and do the byte tricks ourselves.
    struct TokenPricesCompactData {
        bytes14 buy;  // change buy price of token from baseBuyPrice in 10 bps
        bytes14 sell; // change sell price of token from baseSellPrice in 10 bps

        uint32 blockNumber;
    } */

    uint public validPriceDurationInBlocks = 10; // prices are valid for this amount of blocks
    mapping(address=>TokenData) tokenData;
    bytes32[] tokenPricesCompactData;
    uint public numTokensInCurrentCompactData = 0;
    address public reserveContract;
    uint constant NUM_TOKENS_IN_COMPACT_DATA = 14;
    uint constant BYTES_14_OFFSET = (2 ** (8 * NUM_TOKENS_IN_COMPACT_DATA));

    function Pricing(address _admin) public VolumeImbalanceRecorder(_admin) { }

    function addToken(ERC20 token) public onlyAdmin {

        require(!tokenData[token].listed);
        tokenData[token].listed = true;

        if(numTokensInCurrentCompactData == 0) {
            tokenPricesCompactData.length++; // add new structure
        }

        tokenData[token].compactDataArrayIndex = tokenPricesCompactData.length - 1;
        tokenData[token].compactDataFieldIndex = numTokensInCurrentCompactData;

        numTokensInCurrentCompactData = (numTokensInCurrentCompactData + 1) % NUM_TOKENS_IN_COMPACT_DATA;

        setGarbageToVolumeRecorder(token);
    }

    function setCompactData(bytes14[] buy, bytes14[] sell, uint blockNumber, uint[] indices) public onlyOperator {

        require(buy.length == sell.length);
        require(indices.length == buy.length);

        uint bytes14Offset = BYTES_14_OFFSET;

        for(uint i = 0; i < indices.length; i++) {
            require(indices[i] < tokenPricesCompactData.length);
            uint data = uint(buy[i]) | uint(sell[i]) * bytes14Offset  | (blockNumber * (bytes14Offset*bytes14Offset));
            tokenPricesCompactData[indices[i]] = bytes32(data);
        }
    }

    function setBasePrice(
        ERC20[] tokens,
        uint[] baseBuy,
        uint[] baseSell,
        bytes14[] buy,
        bytes14[] sell,
        uint blockNumber,
        uint[] indices
    )
        public
        onlyOperator
    {
        require(tokens.length == baseBuy.length);
        require(tokens.length == baseSell.length);
        require(sell.length == buy.length);
        require(sell.length == indices.length);

        for(uint ind = 0; ind < tokens.length; ind++) {
            require(tokenData[tokens[ind]].listed);
            tokenData[tokens[ind]].baseBuyPrice = baseBuy[ind];
            tokenData[tokens[ind]].baseSellPrice = baseSell[ind];
        }

        setCompactData(buy, sell, blockNumber, indices);
    }

    function setQtyStepFunction(
        ERC20 token,
        int[] xBuy,
        int[] yBuy,
        int[] xSell,
        int[] ySell
    )
        public
        onlyOperator
    {
        require(xBuy.length == yBuy.length);
        require(xSell.length == ySell.length);
        require(tokenData[token].listed);

        tokenData[token].buyPriceQtyStepFunction = StepFunction(xBuy, yBuy);
        tokenData[token].sellPriceQtyStepFunction = StepFunction(xSell, ySell);
    }

    function setImbalanceStepFunction(
        ERC20 token,
        int[] xBuy,
        int[] yBuy,
        int[] xSell,
        int[] ySell
    )
        public
        onlyOperator
    {
        require(xBuy.length == yBuy.length);
        require(xSell.length == ySell.length);
        require(tokenData[token].listed);

        tokenData[token].buyPriceImbalanceStepFunction = StepFunction(xBuy, yBuy);
        tokenData[token].sellPriceImbalanceStepFunction = StepFunction(xSell, ySell);
    }

    function setValidPriceDurationInBlocks(uint duration) public onlyAdmin {
        validPriceDurationInBlocks = duration;
    }

    function enableTokenTrade(ERC20 token) public onlyAdmin {
        require(tokenData[token].listed);
        require(tokenControlInfo[token].minimalRecordResolution != 0);
        tokenData[token].enabled = true;
    }

    function disableTokenTrade(ERC20 token) public onlyAlerter {
        require(tokenData[token].listed);
        tokenData[token].enabled = false;
    }

    function setReserveAddress(address reserve) public onlyAdmin {
        reserveContract = reserve;
    }

    function recordImbalance(
        ERC20 token,
        int buyAmount,
        uint priceUpdateBlock,
        uint currentBlock
    )
        public
    {
        require(msg.sender == reserveContract);

        return addImbalance(token, buyAmount, priceUpdateBlock, currentBlock);
    }

    function getPrice(ERC20 token, uint currentBlockNumber, bool buy, uint qty) public view returns(uint) {
        // check if trade is enabled
        if(!tokenData[token].enabled) return 0;
        if(tokenControlInfo[token].minimalRecordResolution == 0) return 0; // token control info not set

        // get price update block
        bytes32 compactData = tokenPricesCompactData[tokenData[token].compactDataArrayIndex];

        uint updatePriceBlock = getLast4Bytes(compactData);
        if(currentBlockNumber >= updatePriceBlock + validPriceDurationInBlocks) return 0; // price is expired
        // check imbalance
        int totalImbalance;
        int blockImbalance;
        (totalImbalance, blockImbalance) = getImbalance(token, updatePriceBlock, currentBlockNumber);

        int imbalanceQty = int(qty);
        if(!buy) imbalanceQty *= -1;

        if(abs(totalImbalance + imbalanceQty) >= getMaxTotalImbalance(token)) return 0;
        if(abs(blockImbalance + imbalanceQty) >= getMaxPerBlockImbalance(token)) return 0;

        totalImbalance += imbalanceQty;

        // calculate actual price
        int extraBps;
        int8 priceUpdate;
        uint price;

        if(buy) {
            // start with base price
            price = tokenData[token].baseBuyPrice;

            // add qty overhead
            extraBps = executeStepFunction(tokenData[token].buyPriceQtyStepFunction, int(qty));
            price = addBps(price, extraBps);

            // add imbalance overhead
            extraBps = executeStepFunction(tokenData[token].buyPriceImbalanceStepFunction, totalImbalance);
            price = addBps(price, extraBps);

            // add price update
            priceUpdate = getPriceByteFromCompactData(compactData,token,true);
            extraBps = int(priceUpdate) * 10;
            price = addBps(price, extraBps);
        } else {
            // start with base price
            price = tokenData[token].baseSellPrice;

            // add qty overhead
            extraBps = executeStepFunction(tokenData[token].sellPriceQtyStepFunction, int(qty));
            price = addBps(price, extraBps);

            // add imbalance overhead
            extraBps = executeStepFunction(tokenData[token].sellPriceImbalanceStepFunction, totalImbalance);
            price = addBps(price, extraBps);

            // add price update
            priceUpdate = getPriceByteFromCompactData(compactData,token,false);
            extraBps = int(priceUpdate) * 10;
            price = addBps(price, extraBps);
        }

        return price;
    }

    function getBasicPrice(ERC20 token, bool buy) public view returns(uint) {
        if(buy) return tokenData[token].baseBuyPrice;
        else return tokenData[token].baseSellPrice;
    }

    function getCompactData(ERC20 token) public view returns(uint, uint, byte, byte) {
        uint arrayIndex = tokenData[token].compactDataArrayIndex;
        uint fieldOffset = tokenData[token].compactDataFieldIndex;

        return (
            arrayIndex,
            fieldOffset,
            byte(getPriceByteFromCompactData(tokenPricesCompactData[arrayIndex], token, true)),
            byte(getPriceByteFromCompactData(tokenPricesCompactData[arrayIndex],token, false))
        );
    }

    function getPriceUpdateBlock(ERC20 token) public view returns(uint) {
        bytes32 compactData = tokenPricesCompactData[tokenData[token].compactDataArrayIndex];
        return getLast4Bytes(compactData);
    }

    function getLast4Bytes(bytes32 b) pure internal returns(uint) {
        // cannot trust compiler with not turning bit operations into EXP opcode
        return uint(b) / (BYTES_14_OFFSET * BYTES_14_OFFSET);
    }

    function getPriceByteFromCompactData(bytes32 data, ERC20 token, bool buy) view internal returns(int8) {
        uint fieldOffset = tokenData[token].compactDataFieldIndex;
        uint byteOffset;
        if(buy) byteOffset = 32 - NUM_TOKENS_IN_COMPACT_DATA + fieldOffset;
        else byteOffset = 4 + fieldOffset;

        return int8(data[byteOffset]);
    }

    function executeStepFunction(StepFunction f, int x) pure internal returns(int) {
        uint len = f.y.length;
        for(uint ind = 0; ind < len; ind++) {
            if(x <= f.x[ind]) return f.y[ind];
        }

        return f.y[len-1];
    }

    function addBps(uint price, int bps) pure internal returns(uint) {
        uint maxBps = 100 * 100;
        return (price * uint(int(maxBps) + bps)) / maxBps;
    }

    function abs(int x) pure internal returns(uint) {
        if(x < 0) return uint(-1 * x);
        else return uint(x);
    }
}

contract KyberWhiteList is Withdrawable {

    uint public weiPerSgd; // amount of weis in 1 singapore dollar
    mapping (address=>uint) public userCategory; // each user has a category that defines cap on trade amount. 0 will be standard
    mapping (uint=>uint)    public categoryCap;  // will define cap on trade amount per category in singapore Dollar.

    function KyberWhiteList(address _admin) public {
        admin = _admin;
    }

    event SetUserCategory(address user, uint category);

    function setUserCategory(address user, uint category) public onlyOperator {
        userCategory[user] = category;
        SetUserCategory(user, category);
    }

    event SetCategoryCap (uint category, uint sgdCap);

    function setCategoryCap(uint category, uint sgdCap) public onlyOperator {
        categoryCap[category] = sgdCap;
        SetCategoryCap (category, sgdCap);
    }

    event SetSgdToWeiRate (uint rate);

    function setSgdToEthRate(uint _sgdToWeiRate) public onlyOperator {
        weiPerSgd = _sgdToWeiRate;
        SetSgdToWeiRate(_sgdToWeiRate);
    }

    function getUserCapInWei(address user) external view returns (uint userCapWei) {
        uint category = userCategory[user];
        return (categoryCap[category] * weiPerSgd);
    }
}

interface BurnableToken {
    function transferFrom(address _from, address _to, uint _value) public returns (bool);
    function burnFrom(address _from, uint256 _value) public returns (bool);
}