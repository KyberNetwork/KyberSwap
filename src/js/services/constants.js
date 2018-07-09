//import BigNumber from "bignumber.js"
import BLOCKCHAIN_INFO from "../../../env"
// abis
const ERC20 = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "minter", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "createIlliquidToken", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endMintingTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "createToken", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "illiquidBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "LOCKOUT_PERIOD", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "o_remaining", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "makeLiquid", "outputs": [], "payable": false, "type": "function" }, { "inputs": [{ "name": "_minter", "type": "address" }, { "name": "_endMintingTime", "type": "uint256" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_recipient", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Approval", "type": "event" }]
const KYBER_NETWORK = [{"constant":false,"inputs":[{"name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"reserve","type":"address"},{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"add","type":"bool"}],"name":"listPairForReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"perReserveListedPairs","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"enabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxGasPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"negligibleRateDiff","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeBurnerContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"expectedRateContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"whiteListContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getUserCapInWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_enable","type":"bool"}],"name":"setEnable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isReserve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAlerters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"srcQty","type":"uint256"}],"name":"getExpectedRate","outputs":[{"name":"expectedRate","type":"uint256"},{"name":"slippageRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reserves","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"reserve","type":"address"},{"name":"add","type":"bool"}],"name":"addReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_whiteList","type":"address"},{"name":"_expectedRate","type":"address"},{"name":"_feeBurner","type":"address"},{"name":"_maxGasPrice","type":"uint256"},{"name":"_negligibleRateDiff","type":"uint256"}],"name":"setParams","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"srcQty","type":"uint256"}],"name":"findBestRate","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"}],"name":"trade","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNumReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_admin","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"EtherReceival","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"src","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"actualSrcAmount","type":"uint256"},{"indexed":false,"name":"actualDestAmount","type":"uint256"}],"name":"ExecuteTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"reserve","type":"address"},{"indexed":false,"name":"add","type":"bool"}],"name":"AddReserveToNetwork","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"reserve","type":"address"},{"indexed":false,"name":"src","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"add","type":"bool"}],"name":"ListReservePairs","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAlerter","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"}]

const KYBER_WRAPPER = [{"constant":true,"inputs":[{"name":"x","type":"bytes14"},{"name":"byteInd","type":"uint256"}],"name":"getInt8FromByte","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"reserve","type":"address"},{"name":"tokens","type":"address[]"}],"name":"getBalances","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pricingContract","type":"address"},{"name":"tokenList","type":"address[]"}],"name":"getTokenIndicies","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes14"},{"name":"byteInd","type":"uint256"}],"name":"getByteFromBytes14","outputs":[{"name":"","type":"bytes1"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"network","type":"address"},{"name":"sources","type":"address[]"},{"name":"dests","type":"address[]"},{"name":"qty","type":"uint256[]"}],"name":"getExpectedRates","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pricingContract","type":"address"},{"name":"tokenList","type":"address[]"}],"name":"getTokenRates","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"int8[]"},{"name":"","type":"int8[]"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}]

const KYBER_WALLET = [{ "constant": true, "inputs": [], "name": "ETH_TOKEN_ADDRESS", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "srcToken", "type": "address" }, { "name": "srcAmount", "type": "uint256" }, { "name": "destToken", "type": "address" }, { "name": "maxDestAmount", "type": "uint256" }, { "name": "minRate", "type": "uint256" }, { "name": "destination", "type": "address" }, { "name": "destinationData", "type": "bytes" }, { "name": "onlyApproveTokens", "type": "bool" }, { "name": "throwOnFail", "type": "bool" }], "name": "convertAndCall", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "network", "type": "address" }], "name": "setKyberNetwork", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "token", "type": "address" }, { "name": "from", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "recieveTokens", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "recieveEther", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }, { "name": "data", "type": "bytes" }], "name": "execute", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "kyberNetwork", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "_kyberNetwork", "type": "address" }], "payable": false, "type": "constructor" }, { "payable": true, "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "origin", "type": "address" }, { "indexed": false, "name": "error", "type": "uint256" }, { "indexed": false, "name": "errorInfo", "type": "uint256" }], "name": "ErrorReport", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": false, "name": "kyberNetwork", "type": "address" }], "name": "NewWallet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "sender", "type": "address" }, { "indexed": false, "name": "network", "type": "address" }], "name": "SetKyberNetwork", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "sender", "type": "address" }, { "indexed": false, "name": "amountInWei", "type": "uint256" }], "name": "IncomingEther", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "from", "type": "address" }, { "indexed": false, "name": "token", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "IncomingTokens", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "sender", "type": "address" }, { "indexed": false, "name": "destination", "type": "address" }, { "indexed": false, "name": "destAmount", "type": "uint256" }], "name": "ConvertAndCall", "type": "event" }]

// contract datas
// compiled with v0.4.11+commit.68ef5810
const KYBER_WALLET_DATA = '0x6060604052341561000c57fe5b604051602080610f6b83398101604052515b60008054600160a060020a03338116600160a060020a03199283168117909355600180548583169316929092179182905560408051929091168252517fad99b4cdeb342f8df51bd1f7c20113a98559ff13b06d1c77cc051964d7489d2b9181900360200190a25b505b610ed5806100966000396000f300606060405236156100725763ffffffff60e060020a6000350416631878d1f1811461008357806331bc65ec146100af57806354a325a61461013657806362895bf9146101545780638da5cb5b1461017b5780638f4062d7146101a7578063b61d27f6146101b1578063b78b842d14610216575b6100815b61007e610242565b5b565b005b341561008b57fe5b610093610288565b60408051600160a060020a039092168252519081900360200190f35b34156100b757fe5b604080516020601f60c43560048181013592830184900484028501840190955281845261008194600160a060020a0381358116956024803596604435841696606435966084359660a435909616959460e4949093910191908190840183828082843750949650505050823515159260200135151591506102a09050565b005b341561013e57fe5b610081600160a060020a0360043516610ae7565b005b341561015c57fe5b610081600160a060020a0360043581169060243516604435610be2565b005b341561018357fe5b610093610d09565b60408051600160a060020a039092168252519081900360200190f35b610081610242565b005b34156101b957fe5b604080516020600460443581810135601f8101849004840285018401909552848452610081948235600160a060020a0316946024803595606494929391909201918190840183828082843750949650610d1895505050505050565b005b341561021e57fe5b610093610e7a565b60408051600160a060020a039092168252519081900360200190f35b60408051600160a060020a033316815234602082015281517f6acab2c69f1af70741e03a20158ab72691883e31e47feaff53b10e6ecabf5950929181900390910190a15b565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee81565b600080548190819033600160a060020a039081169116146102fe57600054604080516308a0000f8152600160a060020a03928316602082015281513390931692600080516020610e8a833981519152929181900390910190a2610ad9565b600160a060020a038c1673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee1415610378578a30600160a060020a031631101561037357604080516308a000008152600160a060020a0330811631602083015282513390911692600080516020610e8a833981519152928290030190a2610ad9565b6104a6565b8a8c600160a060020a03166370a08231306000604051602001526040518263ffffffff1660e060020a0281526004018082600160a060020a0316600160a060020a03168152602001915050602060405180830381600087803b15156103d957fe5b6102c65a03f115156103e757fe5b5050506040518051905010156104a65733600160a060020a0316600080516020610e8a8339815191526308a000018e600160a060020a03166370a08231306000604051602001526040518263ffffffff1660e060020a0281526004018082600160a060020a0316600160a060020a03168152602001915050602060405180830381600087803b151561047557fe5b6102c65a03f1151561048357fe5b5050604080518051938152602081019390935280519283900301919050a2610ad9565b5b5b60009250600160a060020a038c1673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee14156104d9578a9250610568565b8b600160a060020a031663095ea7b3600160009054906101000a9004600160a060020a03168d6000604051602001526040518363ffffffff1660e060020a0281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050602060405180830381600087803b151561055657fe5b6102c65a03f1151561056457fe5b5050505b600160009054906101000a9004600160a060020a0316600160a060020a03166393766a57848e8e8e308f8f8c6000604051602001526040518963ffffffff1660e060020a0281526004018088600160a060020a0316600160a060020a0316815260200187815260200186600160a060020a0316600160a060020a0316815260200185600160a060020a0316600160a060020a03168152602001848152602001838152602001821515151581526020019750505050505050506020604051808303818588803b151561063557fe5b6125ee5a03f1151561064357fe5b5050604051519350505081151561068e57604080516308a000028152600060208201528151600160a060020a03331692600080516020610e8a833981519152928290030190a2610ad9565b600160a060020a038c1673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee14610742578b600160a060020a031663095ea7b3600160009054906101000a9004600160a060020a031660006000604051602001526040518363ffffffff1660e060020a0281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050602060405180830381600087803b151561073057fe5b6102c65a03f1151561073e57fe5b5050505b506000600160a060020a038a1673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee1415610771575080610870565b84156107f65789600160a060020a031663095ea7b388846000604051602001526040518363ffffffff1660e060020a0281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050602060405180830381600087803b15156107df57fe5b6102c65a03f115156107ed57fe5b50610870915050565b89600160a060020a031663a9059cbb88846000604051602001526040518363ffffffff1660e060020a0281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050602060405180830381600087803b151561085e57fe5b6102c65a03f1151561086c57fe5b5050505b5b86600160a060020a03168187604051808280519060200190808383600083146108b5575b8051825260208311156108b557601f199092019160209182019101610895565b505050905090810190601f1680156108e15780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876187965a03f19250505015156109c157604080516308a000038152600060208201528151600160a060020a03331692600080516020610e8a833981519152928290030190a283156109415760006000fd5b89600160a060020a031663095ea7b38860006000604051602001526040518363ffffffff1660e060020a0281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050602060405180830381600087803b15156109aa57fe5b6102c65a03f115156109b857fe5b50610ad9915050565b600160a060020a038a1673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee14610a605789600160a060020a031663095ea7b38860006000604051602001526040518363ffffffff1660e060020a0281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050602060405180830381600087803b1515610a4e57fe5b6102c65a03f11515610a5c57fe5b5050505b60408051600080825260208201528151600160a060020a03331692600080516020610e8a833981519152928290030190a260408051600160a060020a03898116825260208201859052825133909116927fe41d93a6c4695d694fdf20bb43f83cbe9241fd93d3e006681b0dbb878c4ccdcb928290030190a25b505050505050505050505050565b60005433600160a060020a03908116911614610b40576000546040805163089000008152600160a060020a03928316602082015281513390931692600080516020610e8a833981519152929181900390910190a2610bdf565b6001805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383811691909117909155604080516000808252602082015281513390931692600080516020610e8a833981519152929181900390910190a260408051600160a060020a03838116825291513392909216917faa9f606b274c2108ce1510609f5869908eab2ea65a7f5ba079342947b90bb9529181900360200190a25b50565b604080516000602091820181905282517f23b872dd000000000000000000000000000000000000000000000000000000008152600160a060020a0386811660048301523081166024830152604482018690529351938716936323b872dd9360648084019491938390030190829087803b1515610c5a57fe5b6102c65a03f11515610c6857fe5b50506040515115159050610cb957600054604080516308a000008152600160a060020a03928316602082015281513390931692600080516020610e8a833981519152929181900390910190a2610d04565b60408051600160a060020a0380851682528516602082015280820183905290517f398d8a3700939787db04d51a4e438f3b7b489c2afd06fe414fb57f9e7d175c449181900360600190a15b505050565b600054600160a060020a031681565b60005433600160a060020a03908116911614610d7157600054604080516308b000008152600160a060020a03928316602082015281513390931692600080516020610e8a833981519152929181900390910190a2610d04565b82600160a060020a0316828260405180828051906020019080838360008314610db5575b805182526020831115610db557601f199092019160209182019101610d95565b505050905090810190601f168015610de15780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876187965a03f1925050501515610e4357600054604080516308b000018152600160a060020a03928316602082015281513390931692600080516020610e8a833981519152929181900390910190a2610d04565b60408051600080825260208201528151600160a060020a03331692600080516020610e8a833981519152928290030190a25b505050565b600154600160a060020a031681560005d2f3e2f3e0a781082873c332729f77c49ee05d757ef3d1e5058fa0d883f36fa165627a7a72305820d185bfb4e7e204fbe2776e15ecd44f406d7c6a3e3f984f26697e9a44f5e483d10029'
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
// constants
const EPSILON = 1000000000000000
const RATE_EPSILON = 0.002
const MAX_CAP_PERCENT = 0.95

const MAX_CAP_ONE_EXCHANGE_BASE_VALUE = "10000000000000000000" //10 ETH
const MAX_CAP_ONE_EXCHANGE_BASE_RESERVE = 0.5 //50% 



// const NODE_ENDPOINT = "https://kovan.kyber.network"
const ETHER_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
//const NETWORK_ADDRESS = "0x00a8a6f8db6793174d500b0eb9e1f5b2402f80c3"
//const TRADE_TOPIC = "0xec0d3e799aa270a144d7e3be084ccfc657450e33ecea1b1a4154c95cedaae5c3"
//const RESERVE_ADDRESS = "0x98990ee596d7c383a496f54c9e617ce7d2b3ed46"

var secondKey = Object.keys(BLOCKCHAIN_INFO.tokens)[1]

const INIT_EXCHANGE_FORM_STATE = {
  kyber_enabled: false,
  advanced: false,
  termAgree: true,
  passphrase: false,  
  selected: false,
  isSelectToken: false,
  sourceToken: ETHER_ADDRESS,
  sourceTokenSymbol: "ETH",
  sourceAmount: "",
  destAmount: "",
  destToken: BLOCKCHAIN_INFO.tokens[secondKey].address,
  destTokenSymbol: secondKey,

  destAddress: "",
  inputFocus: "source",

  maxCap: 0,
  minConversionRate: 0,
  minDestAmount: 0,
  maxDestAmount: 0,
 // rangeSetRate: 0.5, // 5 eth
  prevAmount:0,

  offeredRate: 0,
  isEditRate : false,
  slippageRate: 0,
  blockNo: 0,

  throwOnFailure: "0x0000000000000000000000000000000000000000",
  gas: 330000,
  max_gas: 330000,

  gas_approve: 0,
  max_gas_approve: 100000,
  
  //max_gas_total: 430000,

  isFetchingGas: false,
  gasPrice: 20,
  gasPriceSuggest: {
    fastGas: 20,
    standardGas: 20,
    safeLowGas: 20,
    
    fastTime: 2, //minutes
    standardTime: 5,
    lowTime: 30
  },
  maxGasPrice: 50,
  isEditGasPrice: false,

  step: 2,
  broadcasting: true,
  bcError: "",
  txHash: "",
  //txRaw: "",
  tempTx: {},
  txApprove: false,
  confirmApprove: false,
  isConfirming: false,
  isApproving: false,
  confirmColdWallet: false,
  signError: "",
  broadcastError: "",
  balanceData:{
    sourceName: "Ether",
    sourceSymbol: "ETH",
    sourceDecimal: 18,
    // prevSource : 0,
    // nextSource: 0,

    destName: "Kyber",
    destSymbol: "KNC",
    destDecimal: 18,
    // prevDest: 0,
    // nextDest: 0,

    sourceAmount: 0,
    destAmount: 0
  },

  // error_rate_amount: false,
  // error_rate_system: false,
  errors: {
    selectSameToken: '',
    selectTokenToken: '',
    sourceAmountError: '',
    gasPriceError: '',
    gasError: '',
    passwordError: '',
    signTransaction: '',
    rateError: '',
    rateAmount: '',
    rateSystem: '',
    ethBalanceError: '',
    exchange_enable:''
  },
  errorNotPossessKgt: '',
  isAnalize: false,
  isAnalizeComplete: false,
  analizeError : {},
  snapshot: {}
}

const INIT_TRANSFER_FORM_STATE = {
  advanced: false,
  termAgree:  true,
  passphrase: false,
  selected: false,
  token: ETHER_ADDRESS,
  tokenSymbol: "ETH",
  amount: "",
  destAddress: "",

  throwOnFailure: "0x0000000000000000000000000000000000000000",
  gas: 21000,
  gas_limit: 100000,
  isFetchingGas: false,
  // gas_estimate: 21000,
  // gas_limit_transfer_eth: 21000,
  // gas_limit_transfer_token: 50000,
  gasPrice: 20,
  gasPriceSuggest: {
    fastGas: 20,
    standardGas: 20,
    safeLowGas: 20,
    
    fastTime: 2, //minutes
    standardTime: 5,
    lowTime: 30
  },
  maxGasPrice: 50,
  isEditGasPrice: false,
  
  step: 1,
  broadcasting: true,
  bcError: "",
  txHash: "",
  tempTx: {},
  isConfirming: false,
  confirmColdWallet: false,
  signError: "",
  broadcastError: "",
  balanceData:{
    tokenName: "Ether",
    tokenSymbol: "ETH",
    tokenDecimal: 18,
    prev : 0,
    next: 0
  },
  errors: {
    gasPrice: '',
    destAddress: '',
    amountTransfer: '',
    passwordError: '',
    signTransaction: '',
    ethBalanceError: ''
  },
  snapshot: {}
}


// reserves
const RESERVES = [{ index: 0, name: "Kyber official reserve" }]

const ETH = {
  name: "Ether",
  symbol: "ETH",
  icon: "/img/ether.png",
  address: ETHER_ADDRESS
};

const IDLE_TIME_OUT = 900

const HISTORY_EXCHANGE = {
  page: 0,
  itemPerPage: 5,
  currentBlock: 0,
  eventsCount : 0,
  isFetching: false,
  logsEth:[],
  logsToken:[],
  logs: []
}

const CONNECTION_CHECKER = {
  count: 0 ,
  maxCount: 2,
  isCheck: true
}

const CONFIG_ENV_LEDGER_LINK = "https://support.ledgerwallet.com/hc/en-us/articles/115005165269-What-if-Ledger-Wallet-is-not-recognized-on-Linux-"
const LEDGER_SUPPORT_LINK = "https://support.ledgerwallet.com/hc/en-us/articles/115005198565"

const BASE_HOST = ""

const STORAGE_KEY = "128"
module.exports = {
  ERC20, KYBER_NETWORK, KYBER_WRAPPER, EPSILON, ETHER_ADDRESS, ETH, RESERVES, KYBER_WALLET,
  KYBER_WALLET_DATA, INIT_EXCHANGE_FORM_STATE, INIT_TRANSFER_FORM_STATE,
  RATE_EPSILON, IDLE_TIME_OUT, HISTORY_EXCHANGE, STORAGE_KEY, CONNECTION_CHECKER,
  MAX_CAP_ONE_EXCHANGE_BASE_VALUE, MAX_CAP_ONE_EXCHANGE_BASE_RESERVE, MAX_CAP_PERCENT, CONFIG_ENV_LEDGER_LINK, LEDGER_SUPPORT_LINK, TRANSFER_TOPIC, BASE_HOST
}
