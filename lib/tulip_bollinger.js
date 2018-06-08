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
      for (var i = (s.lookback.length - s.marketData.close.length) - 1; i >= 0; i--) {
        s.marketData.close.push(s.lookback[i].close)
      }

      //dont calculate until we have enough data
      if (s.marketData.close.length >= rsi_periods) {
        //fillup marketData for talib.
        //this might need improvment for performance.
        //for (var i = 0; i < length; i++) {
        //  s.marketData.close.push(s.lookback[i].close);
        //}
        //fillup marketData for talib.
        let tmpMarket = s.marketData.close.slice()
    
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

        
    
              //Result format: (note: outReal can have multiple items in the array)
              // {
              //   begIndex: 8,
              //   nbElement: 1,
              //   result: { outReal: [ 1820.8621111111108 ] }
              // }
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


