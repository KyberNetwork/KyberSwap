import { default as _ } from 'underscore';

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
  var tokenWithBalance = []
  tokens.map((token) => {
    if(token.balance && token.balance.greaterThan(0)){
      tokenWithBalance.push(token);
    }
  });
  if(tokenWithBalance.length){
    result[0] = _.sample(tokenWithBalance);
    if(result[0].symbol.toLowerCase() == "eth"){
      let index = tokens.map(x => { return x.symbol}).indexOf(result[0].symbol)
      tokens.splice(index, 1);
      result[1] = _.sample(tokens);
    } else {
      let indexETH = tokens.map(x => { return x.symbol.toLowerCase()}).indexOf("eth")
      result[1] = tokens[indexETH];
    }
    return result;
  } else {
    return null;
  }
}

export function randomForTransfer(token){

}