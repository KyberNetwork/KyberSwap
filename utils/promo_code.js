

var Web3 = require("web3")
var ethUtil = require('ethereumjs-util')


function randomPromoCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}
  
function generatePrivateKey(promoCode){
    var privateKey = promoCode
    for (var i = 0; i< 50; i++){
        privateKey = Web3.utils.sha3(privateKey)
      }
      return privateKey.substring(2)
}

function addressFromPrivateKey(privateKey){
    var addBuf = ethUtil.privateToAddress(new Buffer(privateKey, 'hex'))
    var addrString = ethUtil.bufferToHex(addBuf)
    return addrString
}

function main(){
    var saveArr = {}
    var index = 0
    while (true) {
        if (index >= 250){
            break
        }
        var randomStr = randomPromoCode()
        if (saveArr[randomStr]){
            continue
        }
        console.log(randomStr)
        var privateKey = generatePrivateKey(randomStr)
        var address = addressFromPrivateKey(privateKey)
        saveArr[randomStr] = address
        index++
    }
    console.log(JSON.stringify(saveArr))
    
}

main()