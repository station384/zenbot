var tulind = require('tulind')


module.exports = function stoch(s, key, k_periods, sk_periods, d_periods) 
{
  return new Promise(function(resolve, reject) {
  


    // var o = talib.explain('STOCHF')
    //var o = talib.explain('STOCH')

    // if (!s.marketData) {
    //   s.marketData = { open: [], close: [], high: [], low: [], volume: [] }
    // }
    if (s.lookback.length >= s.marketData.close.length) {
      // for (var i = (s.lookback.length - s.marketData.close.length) - 1; i >= 0; i--) {
      //   s.marketData.close.push(s.lookback[i])
      // }

      //dont calculate until we have enough data
 
      {
        let tmpMarket = s.lookback.reverse()
     
        // for (let i = s.lookback.length-1; i > s.lookback.length-1 - 1000; i--) {
        //   tmpMarket.push(s.lookback[i])
        // }


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
          [tmpMarketHigh, tmpMarketClose, tmpMarketLow],
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

