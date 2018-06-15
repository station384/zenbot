let z = require('zero-fill')
  , n = require('numbro')
  , ti_macd = require('../../../lib/ti_macd')
  , ti_stoch = require('../../../lib/ti_stoch')
  , ti_stochrsi = require('../../../lib/ti_stochrsi')
  , ti_bollinger = require('../../../lib/ti_bollinger')
  , Phenotypes = require('../../../lib/phenotype')
module.exports = {
  name: 'Station-1',
  description: 'Station Adaptive Strategy - 1',

  getOptions: function () {
    this.option('period', 'period length, same as --period_length', String, '5m')
    this.option('period_length', 'period length, same as --period', String, '5m')
    this.option('min_periods', 'min. number of history periods', Number, 200)
    this.option('rsi_periods', 'number of RSI periods',Number, 14)
    
    // macd -- used to detect bear and bull markets
    this.option('short_period', 'number of RSI periods',Number, 12)
    this.option('long_period', 'number of RSI periods',Number, 26)
    this.option('signal_period', 'number of RSI periods',Number, 9)

    // Lots of options.  I would have this as some sort of passed in object using JSON but it needs to be individual for backtesters to work

    //Bull Long Market.   
    this.option('bll_mode', 'The trigger to use', String, 'stoch') // 'stoch, stochrsi, none, sell, buy'
    this.option('bll_stoch_kperiods', 'number of RSI periods', Number, 9)
    this.option('bll_stoch_k', '%D line', Number, 5)
    this.option('bll_stoch_d', '%D line', Number, 3)
    this.option('bll_stoch_k_sell', 'K must be above this before selling', Number, 60)
    this.option('bll_stoch_k_buy', 'K must be below this before buying', Number, 40)

    this.option('bll_stochrsi_kperiods', 'number of RSI periods', Number, 9)
    this.option('bll_stochrsi_k', '%D line', Number, 5)
    this.option('bll_stochrsi_d', '%D line', Number, 3)
    this.option('bll_stochrsi_k_sell', 'K must be above this before selling', Number, 60)
    this.option('bll_stochrsi_k_buy', 'K must be below this before buying', Number, 40)

    this.option('bll_bollinger_size', 'period size', Number, 14)
    this.option('bll_bollinger_time', 'times of standard deviation between the upper band and the moving averages', Number, 2)
    this.option('bll_bollinger_upper_bound_pct', 'pct the current price should be near the bollinger upper bound before we sell', Number, 50)
    this.option('bll_bollinger_lower_bound_pct', 'pct the current price should be near the bollinger lower bound before we buy', Number, 50)

    //Bull Short Market
    this.option('bls_mode', 'The trigger to use', String, 'stoch')
    this.option('bls_stoch_kperiods', 'number of RSI periods', Number, 14)
    this.option('bls_stoch_k', '%D line', Number, 5)
    this.option('bls_stoch_d', '%D line', Number, 3)
    this.option('bls_stoch_k_sell', 'K must be above this before selling', Number, 60)
    this.option('bls_stoch_k_buy', 'K must be below this before buying', Number, 40)

    this.option('bls_stochrsi_kperiods', 'number of RSI periods', Number, 9)
    this.option('bls_stochrsi_k', '%D line', Number, 5)
    this.option('bls_stochrsi_d', '%D line', Number, 3)
    this.option('bls_stochrsi_k_sell', 'K must be above this before selling', Number, 60)
    this.option('bls_stochrsi_k_buy', 'K must be below this before buying', Number, 40)

    this.option('bls_bollinger_size', 'period size', Number, 14)
    this.option('bls_bollinger_time', 'times of standard deviation between the upper band and the moving averages', Number, 2)
    this.option('bls_bollinger_upper_bound_pct', 'pct the current price should be near the bollinger upper bound before we sell', Number, 50)
    this.option('bls_bollinger_lower_bound_pct', 'pct the current price should be near the bollinger lower bound before we buy', Number, 50)

    //Bull Neutral Market
    this.option('bln_mode', 'The trigger to use', String, 'stoch')
    this.option('bln_stoch_kperiods', 'number of RSI periods', Number, 9)
    this.option('bln_stoch_k', '%D line', Number, 5)
    this.option('bln_stoch_d', '%D line', Number, 3)
    this.option('bln_stoch_k_sell', 'K must be above this before selling', Number, 60)
    this.option('bln_stoch_k_buy', 'K must be below this before buying', Number, 40)

    this.option('bln_stochrsi_kperiods', 'number of RSI periods', Number, 9)
    this.option('bln_stochrsi_k', '%D line', Number, 5)
    this.option('bln_stochrsi_d', '%D line', Number, 3)
    this.option('bln_stochrsi_k_sell', 'K must be above this before selling', Number, 60)
    this.option('bln_stochrsi_k_buy', 'K must be below this before buying', Number, 40)

    this.option('bln_bollinger_size', 'period size', Number, 14)
    this.option('bln_bollinger_time', 'times of standard deviation between the upper band and the moving averages', Number, 2)
    this.option('bln_bollinger_upper_bound_pct', 'pct the current price should be near the bollinger upper bound before we sell', Number, 50)
    this.option('bln_bollinger_lower_bound_pct', 'pct the current price should be near the bollinger lower bound before we buy', Number, 50)

    //Bear Long Market.   
    this.option('brl_mode', 'The trigger to use', String, 'stoch')
    this.option('brl_stoch_kperiods', 'number of RSI periods', Number, 9)
    this.option('brl_stoch_k', '%D line', Number, 5)
    this.option('brl_stoch_d', '%D line', Number, 3)
    this.option('brl_stoch_k_sell', 'K must be above this before selling', Number, 60)
    this.option('brl_stoch_k_buy', 'K must be below this before buying', Number, 40)

    this.option('brl_stochrsi_kperiods', 'number of RSI periods', Number, 9)
    this.option('brl_stochrsi_k', '%D line', Number, 5)
    this.option('brl_stochrsi_d', '%D line', Number, 3)
    this.option('brl_stochrsi_k_sell', 'K must be above this before selling', Number, 60)
    this.option('brl_stochrsi_k_buy', 'K must be below this before buying', Number, 40)

    this.option('brl_bollinger_size', 'period size', Number, 14)
    this.option('brl_bollinger_time', 'times of standard deviation between the upper band and the moving averages', Number, 2)
    this.option('brl_bollinger_upper_bound_pct', 'pct the current price should be near the bollinger upper bound before we sell', Number, 50)
    this.option('brl_bollinger_lower_bound_pct', 'pct the current price should be near the bollinger lower bound before we buy', Number, 50)

    //Bull Short Market
    this.option('brs_mode', 'The trigger to use', String, 'stoch')
    this.option('brs_stoch_kperiods', 'number of RSI periods', Number, 14)
    this.option('brs_stoch_k', '%D line', Number, 5)
    this.option('brs_stoch_d', '%D line', Number, 3)
    this.option('brs_stoch_k_sell', 'K must be above this before selling', Number, 60)
    this.option('brs_stoch_k_buy', 'K must be below this before buying', Number, 40)

    this.option('brs_stochrsi_kperiods', 'number of RSI periods', Number, 9)
    this.option('brs_stochrsi_k', '%D line', Number, 5)
    this.option('brs_stochrsi_d', '%D line', Number, 3)
    this.option('brs_stochrsi_k_sell', 'K must be above this before selling', Number, 60)
    this.option('brs_stochrsi_k_buy', 'K must be below this before buying', Number, 40)

    this.option('brs_bollinger_size', 'period size', Number, 14)
    this.option('brs_bollinger_time', 'times of standard deviation between the upper band and the moving averages', Number, 2)
    this.option('brs_bollinger_upper_bound_pct', 'pct the current price should be near the bollinger upper bound before we sell', Number, 50)
    this.option('brs_bollinger_lower_bound_pct', 'pct the current price should be near the bollinger lower bound before we buy', Number, 50)

    //Bull Neutral Market
    this.option('brn_mode', 'The trigger to use', String, 'stoch')
    this.option('brn_stoch_kperiods', 'number of RSI periods', Number, 9)
    this.option('brn_stoch_k', '%D line', Number, 5)
    this.option('brn_stoch_d', '%D line', Number, 3)
    this.option('brn_stoch_k_sell', 'K must be above this before selling', Number, 60)
    this.option('brn_stoch_k_buy', 'K must be below this before buying', Number, 40)

    this.option('brn_stochrsi_kperiods', 'number of RSI periods', Number, 9)
    this.option('brn_stochrsi_k', '%D line', Number, 5)
    this.option('brn_stochrsi_d', '%D line', Number, 3)
    this.option('brn_stochrsi_k_sell', 'K must be above this before selling', Number, 60)
    this.option('brn_stochrsi_k_buy', 'K must be below this before buying', Number, 40)

    this.option('brn_bollinger_size', 'period size', Number, 14)
    this.option('brn_bollinger_time', 'times of standard deviation between the upper band and the moving averages', Number, 2)
    this.option('brn_bollinger_upper_bound_pct', 'pct the current price should be near the bollinger upper bound before we sell', Number, 50)
    this.option('brn_bollinger_lower_bound_pct', 'pct the current price should be near the bollinger lower bound before we buy', Number, 50)

  },
 

  calculate: function (s) {  
    if (s.in_preroll) return 
  },

  onPeriod: function (s, cb) {
    //make sure we have all values
    // compute Stochastic RSI
    s.period.report = {}
    if (s.in_preroll) return cb()
    //bollinger(s, 'bollinger', s.options.bollinger_size)

    let lMarket =  s.lookback.slice(0,1000)
    lMarket = lMarket.map(x=>   { return {period_id: x.period_id, open: x.open, close: x.close, high: x.high, low: x.low, volume: x.volume }})
    lMarket.reverse()
    //add current period
    let ti =   {period_id: s.period.period_id, open: s.period.open, close: s.period.close, high: s.period.high, low: s.period.low, volume: s.period.volume }
    lMarket.shift(ti)

    ti_macd(s, 'ti_macd',  s.options.short_period, s.options.long_period, s.options.signal_period,lMarket).
      then(function(resMacd){
        //macd fast
        //signal slow
        s.marketPosition = 'neutral'
        let macdSignal = resMacd.macd_signal[resMacd.macd_signal.length-1]
        let macd = resMacd.macd[resMacd.macd.length-1]
        let macdHistogram = resMacd.macd_histogram[resMacd.macd_histogram.length-1]
        // macd is fast mover
        // if(resMacd.macd_histogram[resMacd.macd_histogram.length-1] > 0) {
        if(macdHistogram    > 0 ) {
          s.marketPosition = 'bull'
          if(macd  - macdSignal  < 0.01) {
            s.marketPosition = 'bullShort'   // price falling trend rising
          } else
          if(macd - macdSignal    > 0.01) {
            s.marketPosition = 'bullLong'    // price rising trend rising
          } else 
          {
            s.marketPosition = 'bullNeutral'    // price rising trend rising
          }
        }

        // if(resMacd.macd_histogram[resMacd.macd_histogram.length-1] < 0) {
        if(macdHistogram < 0) {
          s.marketPosition = 'bear' 
          if(macd - macdSignal  > 0.01 ) {
            s.marketPosition = 'bearShort'   // price falling trend falling
          } else
          if(macd - macdSignal  < 0.01 ) {
            s.marketPosition = 'bearLong'    // price rising trend falling
          } else 
          {
            s.marketPosition = 'bearNeutral'    // price rising trend rising
          }
        }
        s.period.report.macdhisto = macdHistogram
        s.signal = null
        if( s.marketPosition  == 'bullLong') 
        {
          if(s.options.bll_mode == 'stoch')
          {
            actOnBollinger_Stoch(s,s.options.bll_bollinger_size, s.options.bll_bollinger_time, s.options.bll_bollinger_upper_bound_pct, s.options.bll_bollinger_lower_bound_pct,s.options.bll_stoch_kperiods, s.options.bll_stoch_k, s.options.bll_stoch_d, s.options.bll_stoch_k_sell, s.options.bll_stoch_k_buy, cb, lMarket)
          } else
          if(s.options.bll_mode == 'stochrsi')
          {
            actOnBollinger_StochRSI (s,s.options.bll_bollinger_size, s.options.bll_bollinger_time, s.options.bll_bollinger_upper_bound_pct, s.options.bll_bollinger_lower_bound_pct, s.options.bll_stochrsi_kperiods, s.options.bll_stochrsi_k, s.options.bll_stochrsi_d, s.options.bll_stochrsi_k_sell, s.options.bll_stochrsi_k_buy, cb, lMarket)
          } else
          if(s.options.bll_mode == 'none')
          {
            s.signal = null
            cb()
          }
          else
          if(s.options.bll_mode == 'sell')
          {
            s.signal = 'sell'
            cb()
          }
          if(s.options.bll_mode == 'buy')
          {
            s.signal = 'buy'
            cb()
          }
        } else
        if( s.marketPosition  == 'bullShort') 
        {
          if(s.options.bls_mode == 'stoch')
          {
            actOnBollinger_Stoch(s,
              s.options.bls_bollinger_size, 
              s.options.bls_bollinger_time, 
              s.options.bls_bollinger_upper_bound_pct, 
              s.options.bls_bollinger_lower_bound_pct,
              s.options.bls_stoch_kperiods, 
              s.options.bls_stoch_k, 
              s.options.bls_stoch_d, 
              s.options.bls_stoch_k_sell, 
              s.options.bls_stoch_k_buy, 
              cb, 
              lMarket)
          } else
          if(s.options.bls_mode == 'stochrsi')
          {
            actOnBollinger_StochRSI (s,
              s.options.bls_bollinger_size, 
              s.options.bls_bollinger_time, 
              s.options.bls_bollinger_upper_bound_pct, 
              s.options.bls_bollinger_lower_bound_pct, 
              s.options.bls_stochrsi_kperiods, 
              s.options.bls_stochrsi_k, 
              s.options.bls_stochrsi_d, 
              s.options.bls_stochrsi_k_sell, 
              s.options.bls_stochrsi_k_buy, 
              cb, 
              lMarket)
          } else
          if(s.options.bls_mode == 'none')
          {
            s.signal = null
            cb()
          }
          else
          if(s.options.bls_mode == 'sell')
          {
            s.signal = 'sell'
            cb()
          }
          if(s.options.bls_mode == 'buy')
          {
            s.signal = 'buy'
            cb()
          }
        } else
        if( s.marketPosition  == 'bullNeutral') 
        {
          if(s.options.bln_mode == 'stoch')
          {
            actOnBollinger_Stoch(s,
              s.options.bln_bollinger_size, 
              s.options.bln_bollinger_time, 
              s.options.bln_bollinger_upper_bound_pct, 
              s.options.bln_bollinger_lower_bound_pct,
              s.options.bln_stoch_kperiods, 
              s.options.bln_stoch_k, 
              s.options.bln_stoch_d, 
              s.options.bln_stoch_k_sell, 
              s.options.bln_stoch_k_buy, 
              cb, 
              lMarket)
          } else
          if(s.options.bln_mode == 'stochrsi')
          {
            actOnBollinger_StochRSI (s,
              s.options.bln_bollinger_size, 
              s.options.bln_bollinger_time, 
              s.options.bln_bollinger_upper_bound_pct, 
              s.options.bln_bollinger_lower_bound_pct, 
              s.options.bln_stochrsi_kperiods, 
              s.options.bln_stochrsi_k, 
              s.options.bln_stochrsi_d, 
              s.options.bln_stochrsi_k_sell, 
              s.options.bln_stochrsi_k_buy, 
              cb, 
              lMarket)
          } else
          if(s.options.bln_mode == 'none')
          {
            s.signal = null
            cb()
          }
          else
          if(s.options.bln_mode == 'sell')
          {
            s.signal = 'sell'
            cb()
          }
          if(s.options.bln_mode == 'buy')
          {
            s.signal = 'buy'
            cb()
          }        
        } else
        if( s.marketPosition  == 'bearLong') 
        { 
          if(s.options.brl_mode == 'stoch')
          {
            actOnBollinger_Stoch(s,
              s.options.brl_bollinger_size, 
              s.options.brl_bollinger_time, 
              s.options.brl_bollinger_upper_bound_pct, 
              s.options.brl_bollinger_lower_bound_pct,
              s.options.brl_stoch_kperiods, 
              s.options.brl_stoch_k, 
              s.options.brl_stoch_d, 
              s.options.brl_stoch_k_sell, 
              s.options.brl_stoch_k_buy, 
              cb, 
              lMarket)
          } else
          if(s.options.brl_mode == 'stochrsi')
          {
            actOnBollinger_StochRSI (s,
              s.options.brl_bollinger_size, 
              s.options.brl_bollinger_time, 
              s.options.brl_bollinger_upper_bound_pct, 
              s.options.brl_bollinger_lower_bound_pct, 
              s.options.brl_stochrsi_kperiods, 
              s.options.brl_stochrsi_k, 
              s.options.brl_stochrsi_d, 
              s.options.brl_stochrsi_k_sell, 
              s.options.brl_stochrsi_k_buy, 
              cb, 
              lMarket)
          } else
          if(s.options.brl_mode == 'none')
          {
            s.signal = null
            cb()
          }
          else
          if(s.options.brl_mode == 'sell')
          {
            s.signal = 'sell'
            cb()
          }
          if(s.options.brl_mode == 'buy')
          {
            s.signal = 'buy'
            cb()
          }     
        } else 
        if( s.marketPosition  == 'bearShort') 
        {
          if(s.options.brs_mode == 'stoch')
          {
            actOnBollinger_Stoch(s,
              s.options.brs_bollinger_size, 
              s.options.brs_bollinger_time, 
              s.options.brs_bollinger_upper_bound_pct, 
              s.options.brs_bollinger_lower_bound_pct,
              s.options.brs_stoch_kperiods, 
              s.options.brs_stoch_k, 
              s.options.brs_stoch_d, 
              s.options.brs_stoch_k_sell, 
              s.options.brs_stoch_k_buy, 
              cb, 
              lMarket)
          } else
          if(s.options.brs_mode == 'stochrsi')
          {
            actOnBollinger_StochRSI (s,
              s.options.brs_bollinger_size, 
              s.options.brs_bollinger_time, 
              s.options.brs_bollinger_upper_bound_pct, 
              s.options.brs_bollinger_lower_bound_pct, 
              s.options.brs_stochrsi_kperiods, 
              s.options.brs_stochrsi_k, 
              s.options.brs_stochrsi_d, 
              s.options.brs_stochrsi_k_sell, 
              s.options.brs_stochrsi_k_buy, 
              cb, 
              lMarket)
          } else
          if(s.options.brs_mode == 'none')
          {
            s.signal = null
            cb()
          }
          else
          if(s.options.brs_mode == 'sell')
          {
            s.signal = 'sell'
            cb()
          }
          if(s.options.brs_mode == 'buy')
          {
            s.signal = 'buy'
            cb()
          }   
        } else 
        if( s.marketPosition  == 'bearNeutral') 
        {
          if(s.options.brn_mode == 'stoch')
          {
            actOnBollinger_Stoch(s,
              s.options.brn_bollinger_size, 
              s.options.brn_bollinger_time, 
              s.options.brn_bollinger_upper_bound_pct, 
              s.options.brn_bollinger_lower_bound_pct,
              s.options.brn_stoch_kperiods, 
              s.options.brn_stoch_k, 
              s.options.brn_stoch_d, 
              s.options.brn_stoch_k_sell, 
              s.options.brn_stoch_k_buy, 
              cb, 
              lMarket)
          } else
          if(s.options.brn_mode == 'stochrsi')
          {
            actOnBollinger_StochRSI (s,
              s.options.brn_bollinger_size, 
              s.options.brn_bollinger_time, 
              s.options.brn_bollinger_upper_bound_pct, 
              s.options.brn_bollinger_lower_bound_pct, 
              s.options.brn_stochrsi_kperiods, 
              s.options.brn_stochrsi_k, 
              s.options.brn_stochrsi_d, 
              s.options.brn_stochrsi_k_sell, 
              s.options.brn_stochrsi_k_buy, 
              cb, 
              lMarket)
          } else
          if(s.options.brn_mode == 'none')
          {
            s.signal = null
            cb()
          }
          else
          if(s.options.brn_mode == 'sell')
          {
            s.signal = 'sell'
            cb()
          }
          if(s.options.brn_mode == 'buy')
          {
            s.signal = 'buy'
            cb()
          }          
        }
        else
        {
          cb()
        }
      }).catch(function(){cb()})
  },
 
  onReport: function (s) {
    var cols = []
    try{
      if (s.period.report) {
        if (!s.period.report.bollinger)
        {
          s.period.report.bollinger = {}
        }
        let upperBound = s.period.report.bollinger.UpperBand || 0
        let lowerBound = s.period.report.bollinger.LowerBand || 0

        let color = 'grey'
        let color2 = 'grey'
        let marketMode = '---'
        if (s.period.close > (upperBound / 100) * ( 100 + s.options.bollinger_upper_bound_pct)) { color = 'green' } 
        if (s.period.close < (lowerBound / 100) * ( 100 - s.options.bollinger_lower_bound_pct)) { color = 'red' }
        if (s.marketPosition == 'bullLong') { 
          color2 = 'yellow' 
          marketMode='BLL'
        }
        if (s.marketPosition == 'bullShort') { 
          color2 = 'yellow'
          marketMode = 'BLS'
        }
        if (s.marketPosition == 'bullNeutral') { 
          color2 = 'grey'
          marketMode = 'BLN'
        }
        if (s.marketPosition == 'bearLong') { 
          color2 = 'red'
          marketMode = 'BRL'                                  
        }
        if (s.marketPosition == 'bearShort') { 
          color2 = 'red' 
          marketMode = 'BRS'
        }
        if (s.marketPosition == 'bearNeutral') { 
          color2 = 'grey' 
          marketMode = 'BRN'
        }

        cols.push(z(8, n(s.period.close).format('+00.0000'), ' ')[color])
        cols.push(z(8, n(lowerBound ).format('0.000000').substring(0,7), ' ').cyan)
        cols.push(z(8, n(upperBound ).format('0.000000').substring(0,7), ' ').cyan)
        cols.push(z(8, n(s.period.report.stoch_D || 0).format('0.0000').substring(0,7), ' ').cyan)
        cols.push(z(8, n(s.period.report.stoch_K || 0).format('0.0000').substring(0,7), ' ').cyan)
        cols.push(z(5, n(s.period.report.divergent || 0).format('0').substring(0,7), ' ')[color2])
        cols.push(z(3, n(s.period.report._switch || 0) .format('0').substring(0,2), ' ')[color2])
        //        cols.push(z(2, n(s.period.report.macdhisto || 0).format('0.0000').substring(0,7), ' ')[color2bg])
        cols.push(' ',marketMode.substring(0,3)[color2], ' ')
      }
      else {
        cols.push('         ')
      } }
    catch (e)
    {
      cols.push('         ')

    }
    return cols
  },

  phenotypes: 
        {
          // -- common
          period_length: Phenotypes.ListOption(['1m', '2m', '3m', '4m', '5m', '10m','15m','30m']),
          min_periods: Phenotypes.Range(52, 150),
          markdown_buy_pct: Phenotypes.RangeFactor(-1.0, 1.0, 0.1),
          markup_sell_pct: Phenotypes.RangeFactor(-1.0, 1.0, 0.1),
          order_type: Phenotypes.ListOption(['maker', 'taker']),
          sell_stop_pct: Phenotypes.RangeFactor(0.0, 50.0,0.1),
          buy_stop_pct: Phenotypes.RangeFactor(0.0, 50.0,0.1),
          profit_stop_enable_pct: Phenotypes.RangeFactor(0.0, 5.0, 0.1),
          profit_stop_pct: Phenotypes.RangeFactor(0.0, 50.0, 0.1),
          rsi_periods: Phenotypes.Range(10, 30),


          // -- strategy
          // macd
          short_period:Phenotypes.Range(2, 50),
          long_period:Phenotypes.Range(2, 50),
          signal_period:Phenotypes.Range(2, 50),

          // BullLong
          bll_mode:Phenotypes.ListOption(['stoch', 'stochrsi','none','sell','buy']),
          bll_stoch_kperiods:Phenotypes.Range(5, 30),
          bll_stoch_k:Phenotypes.Range(1, 10),
          bll_stoch_d:Phenotypes.Range(1, 10),
          bll_stoch_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          bll_stoch_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
      
          bll_stochrsi_kperiods:Phenotypes.Range(5, 30),
          bll_stochrsi_k:Phenotypes.Range(1, 10),
          bll_stochrsi_d:Phenotypes.Range(1, 10),
          bll_stochrsi_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          bll_stochrsi_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
      
          bll_bollinger_size:Phenotypes.RangeFactor(10, 25, 1),
          bll_bollinger_time:Phenotypes.RangeFactor(1, 3.0, 0.1),
          bll_bollinger_upper_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          bll_bollinger_lower_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
      
          // BullShort
          bls_mode:Phenotypes.ListOption(['stoch', 'stochrsi','none','sell','buy']),
          bls_stoch_kperiods:Phenotypes.Range(5, 30),
          bls_stoch_k:Phenotypes.Range(1, 10),
          bls_stoch_d:Phenotypes.Range(1, 10),
          bls_stoch_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          bls_stoch_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
      
          bls_stochrsi_kperiods:Phenotypes.Range(5, 30),
          bls_stochrsi_k:Phenotypes.Range(1, 10),
          bls_stochrsi_d:Phenotypes.Range(1, 10),
          bls_stochrsi_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          bls_stochrsi_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
      
          bls_bollinger_size:Phenotypes.RangeFactor(10, 25, 1),
          bls_bollinger_time:Phenotypes.RangeFactor(1, 3.0, 0.1),
          bls_bollinger_upper_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          bls_bollinger_lower_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          
          // BullNeutral
          bln_mode:Phenotypes.ListOption(['stoch', 'stochrsi','none','sell','buy']),
          bln_stoch_kperiods:Phenotypes.Range(5, 30),
          bln_stoch_k:Phenotypes.Range(1, 10),
          bln_stoch_d:Phenotypes.Range(1, 10),
          bln_stoch_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          bln_stoch_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
      
          bln_stochrsi_kperiods:Phenotypes.Range(5, 30),
          bln_stochrsi_k:Phenotypes.Range(1, 10),
          bln_stochrsi_d:Phenotypes.Range(1, 10),
          bln_stochrsi_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          bln_stochrsi_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
      
          bln_bollinger_size:Phenotypes.RangeFactor(10, 25, 1),
          bln_bollinger_time:Phenotypes.RangeFactor(1, 3.0, 0.1),
          bln_bollinger_upper_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          bln_bollinger_lower_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),

          // BearLong
          brl_mode:Phenotypes.ListOption(['stoch', 'stochrsi','none','sell','buy']),
          brl_stoch_kperiods:Phenotypes.Range(5, 30),
          brl_stoch_k:Phenotypes.Range(1, 10),
          brl_stoch_d:Phenotypes.Range(1, 10),
          brl_stoch_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          brl_stoch_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
      
          brl_stochrsi_kperiods:Phenotypes.Range(5, 30),
          brl_stochrsi_k:Phenotypes.Range(1, 10),
          brl_stochrsi_d:Phenotypes.Range(1, 10),
          brl_stochrsi_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          brl_stochrsi_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
      
          brl_bollinger_size:Phenotypes.RangeFactor(10, 25, 1),
          brl_bollinger_time:Phenotypes.RangeFactor(1, 3.0, 0.1),
          brl_bollinger_upper_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          brl_bollinger_lower_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),

          // BearShort
          brs_mode:Phenotypes.ListOption(['stoch', 'stochrsi','none','sell','buy']),
          brs_stoch_kperiods:Phenotypes.Range(5, 30),
          brs_stoch_k:Phenotypes.Range(1, 10),
          brs_stoch_d:Phenotypes.Range(1, 10),
          brs_stoch_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          brs_stoch_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),

          brs_stochrsi_kperiods:Phenotypes.Range(5, 30),
          brs_stochrsi_k:Phenotypes.Range(1, 10),
          brs_stochrsi_d:Phenotypes.Range(1, 10),
          brs_stochrsi_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          brs_stochrsi_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),

          brs_bollinger_size:Phenotypes.RangeFactor(10, 25, 1),
          brs_bollinger_time:Phenotypes.RangeFactor(1, 3.0, 0.1),
          brs_bollinger_upper_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          brs_bollinger_lower_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),

          // BearNeutral
          brn_mode:Phenotypes.ListOption(['stoch', 'stochrsi','none','sell','buy']),
          brn_stoch_kperiods:Phenotypes.Range(5, 30),
          brn_stoch_k:Phenotypes.Range(1, 10),
          brn_stoch_d:Phenotypes.Range(1, 10),
          brn_stoch_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          brn_stoch_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),

          brn_stochrsi_kperiods:Phenotypes.Range(5, 30),
          brn_stochrsi_k:Phenotypes.Range(1, 10),
          brn_stochrsi_d:Phenotypes.Range(1, 10),
          brn_stochrsi_k_sell:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          brn_stochrsi_k_buy:Phenotypes.RangeFactor(0.0, 100.0, 1.0),

          brn_bollinger_size:Phenotypes.RangeFactor(10, 25, 1),
          brn_bollinger_time:Phenotypes.RangeFactor(1, 3.0, 0.1),
          brn_bollinger_upper_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          brn_bollinger_lower_bound_pct:Phenotypes.RangeFactor(0.0, 100.0, 1.0),
  
        }
}

function actOnBollinger_Stoch (s, bollinger_size, bollinger_time, bollinger_upper_bound_pct, bollinger_lower_bound_pct, stoch_kperiods, stoch_k, stoch_d, stoch_k_sell, stoch_k_buy, cb, lMarket)  {
  ti_bollinger(s,'ti_bollinger', bollinger_size, bollinger_time, lMarket).
    then(function(inbol){
      ti_stoch(s,'ti_stoch', stoch_kperiods, stoch_k, stoch_d, lMarket).
        then(function(inres) {
          if (!inres) return cb()
          if (inres.k.length == 0) return cb()
          var divergent = inres.k[inres.k.length-1] - inres.d[inres.d.length-1]
          let stoch_D = inres.d[inres.d.length-1]
          let stoch_K = inres.k[inres.k.length-1]
          var last_divergent = inres.k[inres.k.length-2] - inres.d[inres.d.length-2]
          var _switch = 0//s.lookback[0]._switch
          var nextdivergent = (( divergent + last_divergent ) /2) + (divergent - last_divergent) 
          if ((last_divergent <= 0 && (divergent > 0)) ) _switch = 1 // price rising 
          if ((last_divergent >= 0 && (divergent < 0)) ) _switch = -1 // price falling

          s.period.report.divergent = divergent
          s.period.report._switch = _switch
          s.period.report.stoch_D = stoch_D
          s.period.report.stoch_K = stoch_K

          let LowerBand= inbol.LowerBand[inbol.LowerBand.length-1]
          let MiddleBand= inbol.MiddleBand[inbol.MiddleBand.length-1]
          let UpperBand= inbol.UpperBand[inbol.UpperBand.length-1] 
          let bollinger = {
            LowerBand: LowerBand,
            MiddleBand: MiddleBand,
            UpperBand: UpperBand
          }
          s.period.report.bollinger = bollinger


          // K is fast moving

          s.signal = null
          if (_switch != 0  ) 
          {
            if (s.period.close >= MiddleBand && s.period.close >= ((UpperBand / 100) * (100 +  bollinger_upper_bound_pct)) && nextdivergent < divergent && _switch == -1 && stoch_K > stoch_k_sell) 
            {
              s.signal = 'sell'
            } 
            else
            if (s.period.close < (LowerBand / 100) * (100 + bollinger_lower_bound_pct)   &&  nextdivergent >= divergent  && _switch == 1    && stoch_K < stoch_k_buy) 
            {
              s.signal = 'buy'
            } 

          }

          cb()
        }).catch(function(){ 
          cb()
        })
    })
    .catch(function(){ 
      cb()
    })
}


function actOnBollinger_StochRSI (s, bollinger_size, bollinger_time, bollinger_upper_bound_pct, bollinger_lower_bound_pct, stochrsi_kperiods, stochrsi_k, stochrsi_d, stochrsi_k_sell, stochrsi_k_buy, cb, lMarket) {
  ti_bollinger(s,'ti_bollinger', bollinger_size, bollinger_time, lMarket).
    then(function(inbol){
      ti_stochrsi(s,'ti_stoch', stochrsi_kperiods, stochrsi_k, stochrsi_d, lMarket).
        then(function(inres) {
          if (!inres) return cb()
          if (inres.stochk.length == 0) return cb()
          var divergent = inres.stochk[inres.stochk.length-1] - inres.stochd[inres.stochd.length-1]
          //let stochRSI = inres.stochRSI[inres.stochRSI.length-1]
          let stoch_D = inres.stochd[inres.stochd.length-1]
          let stoch_K = inres.stochk[inres.stochk.length-1]
          var last_divergent = inres.stochk[inres.stochk.length-2] - inres.stochd[inres.stochd.length-2]
          var _switch = 0//s.lookback[0]._switch
          var nextdivergent = (( divergent + last_divergent ) /2) + (divergent - last_divergent) 
          if ((last_divergent <= 0 && (divergent > 0)) ) _switch = 1 // price rising 
          if ((last_divergent >= 0 && (divergent < 0)) ) _switch = -1 // price falling

          s.period.report.divergent = divergent
          s.period.report._switch = _switch
          s.period.report.stoch_D = stoch_D
          s.period.report.stoch_K = stoch_K

          let LowerBand= inbol.LowerBand[inbol.LowerBand.length-1]
          let MiddleBand= inbol.MiddleBand[inbol.MiddleBand.length-1]
          let UpperBand= inbol.UpperBand[inbol.UpperBand.length-1] 
          let bollinger = {
            LowerBand: LowerBand,
            MiddleBand: MiddleBand,
            UpperBand: UpperBand
          }
          s.period.report.bollinger = bollinger


          // K is fast moving

          s.signal = null
          if (_switch != 0  ) 
          {
            if (s.period.close >= MiddleBand && s.period.close >= ((UpperBand / 100) * (100 +  bollinger_upper_bound_pct)) && nextdivergent < divergent && _switch == -1 && stoch_K > stochrsi_k_sell) 
            {
              s.signal = 'sell'
            } 
            else
            if (s.period.close < (LowerBand / 100) * (100 + bollinger_lower_bound_pct)   &&  nextdivergent >= divergent  && _switch == 1    && stoch_K < stochrsi_k_buy) 
            {
              s.signal = 'buy'
            } 

          }

          cb()
        }).catch(function(){ 
          cb()
        })
    })
    .catch(function(){ 
      cb()
    })
}





