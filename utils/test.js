var EthereumTx = require("ethereumjs-tx")

var ethUtils = require('ethereumjs-util')


var web3 = require('web3')
var nonce = web3.utils.toHex(9)
var gasPrice =  web3.utils.toHex(20000000000)
var gasLimit = web3.utils.toHex(80000)
var to = '0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1'
var value = web3.utils.toHex(1000000000000000)
var data = ''


//var hash = new EthereumTx(tx.serialize()).hash()
var tx = {
    nonce, gasPrice, gasLimit, to, value, data
}

// var hash = new EthereumTx(tx.serialize()).hash()
// console.log(hash)
var message = ethUtils.rlphash(tx.toString())
console.log(message.toString('hex'))


var sign = '0xe87c2766cfa9acf4f65e31c8203cd92166758680687758cd7744c1cf75a3d5223fa5ebe64efc2003ae9b81706a90c4549aa81881f54792a94562caf6f53c76a11c'
var v = '0xe'
var r = 
87c2766cfa9acf4f65e31c8203cd92166758680687758cd7744c1cf75a3d5223f
a5ebe64efc2003ae9b81706a90c4549aa81881f54792a94562caf6f53c76a11c