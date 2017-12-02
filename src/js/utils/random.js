import { default as _ } from 'underscore';
import constants from "../services/constants"
import BLOCKCHAIN_INFO from "../../../env"
import BigNumber from "bignumber.js"
import * as converter from "../utils/converter"

export function randomToken(numberToken, total){
  if(!numberToken || numberToken < 1) return null;
  if(numberToken == 1){
    return Math.floor(Math.random() * total);
  } else {
    var array = Array.from(Array(total),(x,i)=>i)
    var result = new Array(2);
    result[0] = _.sample(array);
    array.splice(result[0], 1)
    result[1] = _.sample(array);
    return result;
  }
}

// export function randomForExchange(tokens){
//   /// random first element with balance
//   var result = new Array(2);
//   var tokenWithBalance = []
//   Object.keys(tokens).map((hash) => {
//     if(tokens[hash].balance && tokens[hash].balance.greaterThan(0)){
//       tokenWithBalance.push(tokens[hash]);
//     }
//   });
//   if(tokenWithBalance.length){
//     result[0] = _.sample(tokenWithBalance);
//     delete tokens[result[0].symbol];
//   }
//   var freeToken = [];
//   Object.keys(tokens).map((hash) => {
//     freeToken.push(tokens[hash]);
//   });
//   result[1] = _.sample(freeToken);
//   return result;
// }

export function randomForExchange(tokens){
  /// random first element with balance
  var result = new Array(2);
  var tokenWithBalance = {}
  var allTokenObj = {}
  tokens.map((token) => {
    var tokenEpsilon = converter.caculateTokenEpsilon(token.rate, token.decimal, token.symbol)
    // let tokenEpsilon = new BigNumber(10).pow(token.decimal).times(token.rate).div(new BigNumber(10).pow(33))          // 10^decimal * rate / 10^33
    if(token.balance && token.balance.greaterThanOrEqualTo(tokenEpsilon)){
      // tokenWithBalance.push(token);
      
      tokenWithBalance[token.symbol] = token;
    }
    allTokenObj[token.symbol] = token;
  });

  if(tokenWithBalance[BLOCKCHAIN_INFO.tokens.ETH.symbol]){
    result[0] = allTokenObj[BLOCKCHAIN_INFO.tokens.ETH.symbol]
    result[1] = allTokenObj[BLOCKCHAIN_INFO.tokens.KNC.symbol]
    return result;
  }

  if(tokenWithBalance[BLOCKCHAIN_INFO.tokens.KNC.symbol]){
    result[0] = allTokenObj[BLOCKCHAIN_INFO.tokens.KNC.symbol]
    result[1] = allTokenObj[BLOCKCHAIN_INFO.tokens.ETH.symbol]
    return result;
  }


  if(Object.keys(tokenWithBalance).length){
    result[0] = tokenWithBalance[_.sample(Object.keys(tokenWithBalance))];
    if(result[0].symbol.toLowerCase() == "eth"){
      delete allTokenObj[BLOCKCHAIN_INFO.tokens.ETH.symbol]
      result[1] = allTokenObj[_.sample(Object.keys(allTokenObj))];
    } else {
      result[1] = allTokenObj[BLOCKCHAIN_INFO.tokens.ETH.symbol]
    }
    return result;
  }
  return null;
}

export function randomForTransfer(token){

}