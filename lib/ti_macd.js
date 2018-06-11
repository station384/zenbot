var tulind = require('tulind')


module.exports = function macd(s, key, shortPeriod, longPeriod, signalPeriod ,optMarket) 
{
  return new Promise(function(resolve, reject) {
  
    if (s.lookback.length >= Math.max(shortPeriod,longPeriod) ) {

      //dont calculate until we have enough data

      // let tmpMarket = s.lookback.slice(s.lookback.length - Math.max(1000), s.lookback.length)

      // //add current period
      // tmpMarket.push(s.period)

      // let tmpMarketHigh = tmpMarket.map(x => x.high)
      // let tmpMarketClose = tmpMarket.map(x => x.close)
      // let tmpMarketLow = tmpMarket.map(x => x.low)
      // // addCurrentPeriod
      // tmpMarketHigh.push(s.period.high)
      // tmpMarketClose.push(s.period.close)
      // tmpMarketLow.push(s.period.low)
      let tmpMarket = optMarket
      if (!tmpMarket)
      {
        tmpMarket = s.lookback.slice(0, 1000).map(x=>x.close)
        tmpMarket.reverse()
        //add current period
        tmpMarket.push(s.period.close)
      }
      else
      {
        tmpMarket = tmpMarket.map(x=>x.close)
      }
      tulind.indicators.macd.indicator(
        [tmpMarket],//[tmpMarketHigh,tmpMarketLow, tmpMarketClose ],
        [shortPeriod, longPeriod, signalPeriod]
        , function (err, result) {
          if (err) {
            console.log(err)
            reject(err, result)
            return
          }

        
  
          resolve({
            macd: result[0],
            macd_signal: result[1],
            macd_histogram: result[2]
          })
        })
         
    }
    else
    { 
      reject()
    }
  })
}

