var talib = require('talib')

module.exports = function stoch(s, key, k_periods, sk_periods, k_ma_type, d_periods, d_ma_type) 
{
  return new Promise(function(resolve, reject) {
  


    // var o = talib.explain('STOCHF')
    //var o = talib.explain('STOCH')

    if (!s.marketData) {
      s.marketData = { open: [], close: [], high: [], low: [], volume: [] }
    }
    if (s.lookback.length >= s.marketData.close.length) {
      for (var i = (s.lookback.length - s.marketData.close.length) - 1; i >= 0; i--) {
        s.marketData.close.push(s.lookback[i])
      }

      //dont calculate until we have enough data
      {
        //s.marketData.close.length > rsi_periods) {
        //fillup marketData for talib.
        //this might need improvment for performance.
        //for (var i = 0; i < length; i++) {
        //  s.marketData.close.push(s.lookback[i].close);
        //}
        //fillup marketData for talib.
        let tmpMarket = s.lookback.reverse()
        let tmpMarketHigh = tmpMarket.map(x => x.high)
        let tmpMarketClose = tmpMarket.map(x => x.close)
        let tmpMarketLow = tmpMarket.map(x => x.low)
        // addCurrentPeriod
        tmpMarketHigh.push(s.period.high)
        tmpMarketClose.push(s.period.close)
        tmpMarketLow.push(s.period.low)

    
     
        //add current period
        //  tmpMarket.push(s.period.close)
        
      
        //doublecheck length.
        {
          //tmpMarket.length >= rsi_periods
          // extract int from string input for ma_type
          let optInSlowDMAType = getMaTypeFromString(d_ma_type)
          let optInSlowKMAType = getMaTypeFromString(k_ma_type)
          talib.execute({
            name: 'STOCH',
            startIdx:  0 ,
            endIdx: tmpMarketClose.length - 1,
            high:  tmpMarketHigh,
            low: tmpMarketLow,
            close: tmpMarketClose,            
            optInFastK_Period:k_periods, // K 5 default
            optInSlowK_Period:sk_periods, //Slow K 3 default
            optInSlowK_MAType:optInSlowKMAType, //Slow K maType default 0
            optInSlowD_Period:d_periods, // D 3 default
            optInSlowD_MAType:optInSlowDMAType // type of Fast D default 0 

          }, function (err, result) {
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
              k: result.result.outSlowK,
              d: result.result.outSlowD
            })
    

          })
        }
      
      }
     
    }
    else
    { 
      resolve()
    }
  })
}

/**
     * Extract int from string input eg (SMA = 0)
     *
     * @see https://github.com/oransel/node-talib
     * @see https://github.com/markcheno/go-talib/blob/master/talib.go#L20
     */
function getMaTypeFromString(maType) {
  // no constant in lib?
    
  switch (maType.toUpperCase()) {
  case 'SMA':
    return 0
  case 'EMA':
    return 1
  case 'WMA':
    return 2
  case 'DEMA':
    return 3
  case 'TEMA':
    return 4
  case 'TRIMA':
    return 5
  case 'KAMA':
    return 6
  case 'MAMA':
    return 7
  case 'T3':
    return 8
  default:
    return 0
  }
}
