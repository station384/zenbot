var tulind = require('tulind')


module.exports = function stoch(s, key, k_periods, sk_periods, d_periods) 
{
  return new Promise(function(resolve, reject) {
  
    if (s.lookback.length >= Math.max(k_periods,d_periods,sk_periods) ) {

      //dont calculate until we have enough data
 
      {
        let tmpMarket = s.lookback.slice(s.lookback.length - Math.max(k_periods,d_periods,sk_periods,1000), s.lookback.length)
     

        //add current period
        tmpMarket.push(s.period)



        let tmpMarketHigh = tmpMarket.map(x => x.high)
        let tmpMarketClose = tmpMarket.map(x => x.close)
        let tmpMarketLow = tmpMarket.map(x => x.low)
        // addCurrentPeriod
        tmpMarketHigh.push(s.period.high)
        tmpMarketClose.push(s.period.close)
        tmpMarketLow.push(s.period.low)

     

        
        tulind.indicators.stoch.indicator(
          [tmpMarketHigh,tmpMarketLow, tmpMarketClose ],
          [k_periods, sk_periods, d_periods]
          , function (err, result) {
            if (err) {
              console.log(err)
              reject(err, result)
              return
            }

        
  
            resolve({
              k: result[0],
              d: result[1]
            })
          })
      }   
    }
    else
    { 
      resolve()
    }
  })
}

