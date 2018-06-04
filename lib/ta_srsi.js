var talib = require('talib')

module.exports = function srsi(s, key, rsi_periods, k_periods, d_periods, d_ma_type) 
{
  return new Promise(function(resolve, reject) {
  


    //var o = talib.explain('STOCHRSI')


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
          let optInMAType = getMaTypeFromString(d_ma_type)
          talib.execute({
            name: 'STOCHRSI',
            startIdx: 0,
            endIdx: tmpMarket.length -1,
            inReal: tmpMarket,
            optInTimePeriod: rsi_periods,  //RSI 14 default
            optInFastK_Period:k_periods, // K 5 default
            optInFastD_Period:d_periods, // D 3 default
            optInFastD_MAType:optInMAType // type of Fast D default 0 

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
              outFastK: result.result.outFastK,
              outFastD: result.result.outFastD
            })
    

          })
        }
        else {
          resolve()
        }
      }
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
