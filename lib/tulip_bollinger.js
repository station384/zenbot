var tulind = require('tulind')


module.exports = function tulip_bollinger(s, key, rsi_periods, StdDev) 
{
 

  return new Promise(function(resolve, reject) {
    // console.log('Tulip Indicators version is:')
    // console.log(tulind.version)
    // console.log(tulind.indicators.bbands)
    if (!s.marketData) {
      s.marketData = { open: [], close: [], high: [], low: [], volume: [] }
    }
    if (s.lookback.length > s.marketData.close.length) {
      for (let i = (s.lookback.length - s.marketData.close.length) - 1; i >= 0; i--) {
        s.marketData.close.push(s.lookback[i].close)
      }

      //dont calculate until we have enough data
      if (s.marketData.close.length >= rsi_periods) {
        //fillup marketData for tulip.
        //this might need improvment for performance.
        //for (var i = 0; i < length; i++) {
        //  s.marketData.close.push(s.lookback[i].close);
        //}
        // we don't want or need all the market data for this.   kinda have to do a loop :/
        let tmpMarket = []// s.marketData.close.slice()
    
        for (let i = s.marketData.close.length-1; i > s.marketData.close.length-1 - 52; i--) {
          tmpMarket.push(s.lookback[i].close)
        }


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
                UpperBand: result[1],
                MiddleBand: result[2],
                LowerBand: result[0]
              })
    

            })
        }
        else {
          reject('MarketLenth not populated enough')
        }
      }
      else{
        reject('MarketLenth not populated enough')
      }
    } else {reject('MarketLenth not populated enough')}
  })
}


