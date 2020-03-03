import BLOCKCHAIN_INFO from "../../../env";

export async function getTokenHighestAndLowestPrice(pair, from, to) {
  return new Promise((resolve, reject) => {
    const url = `${BLOCKCHAIN_INFO.tracker}/chart/history?symbol=${pair}&from=${from}&to=${to}&resolution=60`;
    
    fetch(url).then(async (response) => {
      const data = await response.json();
      
      const highPoints = data.h;
      const lowPoints = data.l;
      
      if (data.s !== 'ok' || !highPoints.length || !lowPoints.length) {
        reject(new Error('Error fetching 24h High and 24h Low data'));
      }
      
      let highestPrice = highPoints[0];
      let lowestPrice = lowPoints[0];
      
      for (let i = 1; i < highPoints.length; i++) {
        if (highPoints[i] > highestPrice) highestPrice = highPoints[i];
        if (lowPoints[i] < lowestPrice) lowestPrice = lowPoints[i];
      }
      
      resolve({ highestPrice, lowestPrice });
    }).catch((error) => {
      reject(error);
    })
  })
}
