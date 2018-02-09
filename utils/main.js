

var BLOCKCHAIN_INFO = require("../env")
var constants = require("../src/js/services/constants")
var Web3 = require("web3")


var rpcUrl  = BLOCKCHAIN_INFO.connections.http[0]
var rpc = new Web3(new Web3.providers.HttpProvider(rpcUrl, 9000))

var kyberAddress = BLOCKCHAIN_INFO.network
var networkContract = new rpc.eth.Contract(constants.KYBER_NETWORK, kyberAddress)

var erc20Contract = new rpc.eth.Contract(constants.ERC20)



console.log(resetApproveKyber("KNC"))

function resetApproveKyber(tokenSymbol){
    var tokenContract = erc20Contract
    tokenContract.options.address = "0xdd974d5c2e2928dea5f71b9825b8b646686bd200"
   // console.log(tokenAddress)
    return tokenContract.methods.approve("0x803e2b13a11c21ec0616cead4a3d2ebe1326f5b0", '0x0').encodeABI()
}