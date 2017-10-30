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