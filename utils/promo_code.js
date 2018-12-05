

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
    //for (var i = 0; i< 1; i++){
        privateKey = Web3.utils.sha3(privateKey)
      //}
      return privateKey.substring(2)
}

function addressFromPrivateKey(privateKey){
    var addBuf = ethUtil.privateToAddress(new Buffer(privateKey, 'hex'))
    var addrString = ethUtil.bufferToHex(addBuf)
    return addrString
}

var mainAddr = "0xa971693e92931d9a66f108eb34c1c1b1d03dcac8"
function getArr(){
    var arr = [
        "Framgia Inc",
        "Framgia Inc.",
        "stateofchain",
        "Stateofchain",
        "framgia",
        "Framgia",
        "longhash",
        "LongHash",
        "Long Hash",
        "LONGHASH",
        "Longhash",
        "umbala",
        "Umbala",
        "Umbala Network",
        "umbala network",
        "tomochain",
        "Tomochain",
        "everitoken",
        "everiToken",
        "Everitoken",
        "Everi",
        "Everi token",
        "infinity",
        "Infinity",
        "Infinity Blockchain Labs", 
        "infinity blockchain labs", 
        "nexty",
        "NextyPlatform",
        "Nexty Platform",
        "nexty platform",
        "Nexty",
        "cybex",
        "Cybex",
        "swissborg",
        "Swissborg",
        "SwissBorg",
        "endurio",
        "Endurio",
        "alis",
        "Alis",
        "pricewaterhousecoopers",
        "Pricewaterhousecoopers",
        "pwc",
        "PWC",
        "PwC",
        "Wookong",
        "wookong",
        "gf.network"
    ]
    var saveArr = []
    for(var i= 0; i< arr.length; i++){
        saveArr.push(arr)
        saveArr.push(arr[i].toLowerCase())
        saveArr.push(arr[i].toUpperCase())
    }

    console.log(saveArr)
    return saveArr
}

// function combineKey(str, index){
//     var len = str.length;    
//     var arr = []

//     for(var i= 0; i< len; i++){
//         combineKey(str.substring(-1))
//     }
//     var savedArr =[]
//     for(var i =0; i<len; i++){

//         for (var j =0; j<savedArr.length;j++){
//             savedArr[j] += arr[i][0]
//             savedArr[j] += arr[i][0]
//         }
//     }
// }

function main(){
    var saveArr = []
    var index = 0
    var list = getArr()
    for (var i = 0; i< list.length; i++){
        var randomStr = list[i]
        
        // for (var j = 0; j< 1; j++){
            var privateKey = Web3.utils.sha3(randomStr)
            privateKey = privateKey.substring(2)
            var address = addressFromPrivateKey(privateKey)
            saveArr.push(address.toLowerCase())
           // }
            //return privateKey.substring(2)
            
        //var privateKey = generatePrivateKey(randomStr)
        
    }

    for (var i = 0; i<saveArr.length; i++){
        if (saveArr[i] == mainAddr){
            console.log(true)
            return
        }
    }
    console.log(false)
    // while (true) {
    //     if (index >= 250){
    //         break
    //     }
    //     var randomStr = randomPromoCode()
    //     if (saveArr[randomStr]){
    //         continue
    //     }
    //     console.log(randomStr)
    //     var privateKey = generatePrivateKey(randomStr)
    //     var address = addressFromPrivateKey(privateKey)
    //     saveArr[randomStr] = address
    //     index++
    // }
   // console.log(JSON.stringify(saveArr))
    
}

main()