var tulind = require('tulind')


module.exports = function tulip_bollinger(s, key, rsi_periods, StdDev) 
{
 

  return new Promise(function(resolve, reject) {


    //dont calculate until we have enough data
    if ( s.lookback.length >= rsi_periods) {
      let tmpMarket = s.lookback.reverse().slice(s.lookback.length - Math.max(rsi_periods,1000), s.lookback.length).map(x=>x.close)

      //add current period
      tmpMarket.push(s.period.close)
    
      //doublecheck length.
      if (tmpMarket.length >= rsi_periods) {
        // extract int from string input for ma_type
         
        tulind.indicators.bbands.indicator(
          [tmpMarket],
          [rsi_periods, StdDev]
          , function (err, result) {
            if (err) {
              console.log(err)
              reject(err, result)
              return
            }

            resolve({
              LowerBand: result[0],
              MiddleBand: result[1],
              UpperBand: result[2]
           
            })
    

          })
      }
      else {
        reject('MarketLenth not populated enough')
      }
 
    } else {
      reject('MarketLenth not populated enough')}
  })
}


