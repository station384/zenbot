let z = require('zero-fill')
  , n = require('numbro')
  , ta_srsi = require('../../../lib/ta_srsi')
  , bollinger = require('../../../lib/bollinger')
  , Phenotypes = require('../../../lib/phenotype')
module.exports = {
  name: 'srsi_bollinger',
  description: 'Stochastic BollingerBand Strategy',

  getOptions: function () {
    this.option('period', 'period length, same as --period_length', String, '5m')
    this.option('period_length', 'period length, same as --period', String, '5m')
    this.option('min_periods', 'min. number of history periods', Number, 200)
    this.option('rsi_periods', 'number of RSI periods', 14)
    this.option('srsi_k', '%D line', Number, 5)
    this.option('srsi_d', '%D line', Number, 3)
    this.option('srsi_k_sell', 'K must be above this before selling', Number, 80)
    this.option('srsi_k_buy', 'K must be below this before buying', Number, 10)
    this.option('srsi_dType','D type mode', String, 'SMA'),

    //'SMA','EMA','WMA','DEMA','TEMA','TRIMA','KAMA','MAMA','T3'
    
    
    this.option('bollinger_size', 'period size', Number, 10)
    this.option('bollinger_time', 'times of standard deviation between the upper band and the moving averages', Number, 2)
    this.option('bollinger_upper_bound_pct', 'pct the current price should be near the bollinger upper bound before we sell', Number, 0.10)
    this.option('bollinger_lower_bound_pct', 'pct the current price should be near the bollinger lower bound before we buy', Number, 1)

  },

  calculate: function () {



  },

  onPeriod: function (s, cb) {
    //make sure we have all values
    // compute Stochastic RSI
    if (s.in_preroll) return cb()
    bollinger(s, 'bollinger', s.options.bollinger_size)
    ta_srsi(s, 'srsi', s.options.rsi_periods, s.options.srsi_k, s.options.srsi_d, s.options.srsi_dType).
      then(function(inres) {
    

        var divergent = inres.outFastK[inres.outFastK.length-1] - inres.outFastD[inres.outFastD.length-1]
        s.period.srsi_D = inres.outFastD[inres.outFastD.length-1]
        s.period.srsi_K = inres.outFastK[inres.outFastK.length-1]
        var divergent1 = s.lookback[0].divergent
        var last_divergent = inres.outFastK[inres.outFastK.length-2] - inres.outFastD[inres.outFastD.length-2]
        var _switch = 0//s.lookback[0]._switch
        var nextdivergent = (( divergent + divergent1 ) /2) + (divergent - divergent1) 
        if ((last_divergent <= 0 && (divergent > 0)) ) _switch = 1 // price rising 
        if ((last_divergent >= 0 && (divergent < 0)) ) _switch = -1 // price falling
        s.period.divergent = divergent
        s.period._switch = _switch
        s.period.nextdivergent = nextdivergent



        if (s.in_preroll) return cb()
        if (s.period.bollinger && inres.outFastD[inres.outFastD.length-1] && inres.outFastK[inres.outFastK.length-1]) {
          if (s.period.bollinger.upper && s.period.bollinger.lower) {
            let upperBound = s.period.bollinger.upper[s.period.bollinger.upper.length-1]
            let lowerBound = s.period.bollinger.lower[s.period.bollinger.lower.length-1]
            //let midBound = s.period.bollinger.mid[s.period.bollinger.upper.length-1]
            //   var divergent =  s.period.divergent//s.divergent
            //    var nextdivergent = s.period.nextdivergent
            //  var _switch = s.period._switch//s._switch 
            // s.options.markdown_buy_pct = s.period.recommendBidPricePct
            // s.options.markup_sell_pct = s.period.recommendBidPricePct
  
  
            // K is fast moving
  
      
            if (_switch != 0  ) // && Math.abs(divergent) >=1
            {
              if (s.period.close > ((upperBound / 100) * (100 - s.options.bollinger_upper_bound_pct)) && nextdivergent <= divergent && _switch == -1 && s.period.srsi_K > s.options.srsi_k_sell) 
              // if (s.period.close >=  midBound   && nextdivergent <= divergent  && s.period.srsi_K > s.options.srsi_k_sell  )  //&& divergent >= 1 
              {
                // if(s.my_trades.length > 0)
                // if(s.my_trades[s.my_trades.length-1].price < s.period.close) 
                // if ((s.period.close > s.last_buy_price) || ( s.period.close / s.last_buy_price  )  > 1.5 )
                s.signal = 'sell'
              } 
              // if ((s.period.close < (lowerBound / 100) * (100 + s.options.bollinger_lower_bound_pct)) && _switch == -1 && s.period.srsi_K < s.options.srsi_k_buy) 
              if (s.period.close <= ((lowerBound / 100) * (100 + s.options.bollinger_lower_bound_pct))  && nextdivergent >= divergent  && _switch == 1    && s.period.srsi_K < s.options.srsi_k_buy) // && divergent <= -1
              //if (s.period.close <= lowerBound   && nextdivergent >= divergent     && s.period.srsi_K < s.options.srsi_k_buy) // && divergent <= -1
  
              {
                s.signal = 'buy'
              } 
          
            }
            else {
              s.signal = null // hold
            }
  
          }
        }
        cb()
      })
  },

  onReport: function (s) {
    var cols = []
    if (s.period.bollinger) {
      if (s.period.bollinger.upper && s.period.bollinger.lower) {
        let upperBound = s.period.bollinger.upper[s.period.bollinger.upper.length-1]
        let lowerBound = s.period.bollinger.lower[s.period.bollinger.lower.length-1]
        var color = 'grey'
        if (s.period.close > (upperBound / 100) * (100 - s.options.bollinger_upper_bound_pct)) {
          color = 'green'
        } else if (s.period.close < (lowerBound / 100) * (100 + s.options.bollinger_lower_bound_pct)) {
          color = 'red'
        }
        cols.push(z(8, n(s.period.close).format('+00.0000'), ' ')[color])
        cols.push(z(8, n(lowerBound).format('0.000000').substring(0,7), ' ').cyan)
        cols.push(z(8, n(upperBound).format('0.000000').substring(0,7), ' ').cyan)
        cols.push(z(8, n(s.period.srsi_D).format('0.0000').substring(0,7), ' ').cyan)
        cols.push(z(8, n(s.period.srsi_K).format('0.0000').substring(0,7), ' ').cyan)
        cols.push(z(5, n(s.period.divergent).format('0').substring(0,7), ' ').cyan)
        cols.push(z(2, n(s.period._switch).format('0').substring(0,2), ' ').cyan)
      }
    }
    else {
      cols.push('         ')
    }
    return cols
  },

  phenotypes: 
        {
          // -- common
          period_length: Phenotypes.ListOption(['1m', '2m', '3m', '4m', '5m']),//, '10m','15m','30m','45m','60m'
          min_periods: Phenotypes.Range(10, 52),
          markdown_buy_pct: Phenotypes.RangeFactor(-1.0, 1.0, 0.1),
          markup_sell_pct: Phenotypes.RangeFactor(-1.0, 1.0, 0.1),
          order_type: Phenotypes.ListOption(['maker', 'taker']),
          sell_stop_pct: Phenotypes.RangeFactor(0.0, 50.0,0.1),
          buy_stop_pct: Phenotypes.RangeFactor(0.0, 50.0,0.1),
          profit_stop_enable_pct: Phenotypes.RangeFactor(0.0, 5.0, 0.1),
          profit_stop_pct: Phenotypes.RangeFactor(0.0, 50.0, 0.1),

          // -- strategy
          rsi_periods: Phenotypes.Range(2, 20),
          srsi_k: Phenotypes.Range(1, 10),
          srsi_d: Phenotypes.Range(1, 10),
          srsi_k_sell: Phenotypes.RangeFactor(60.0, 90.0, 1.0),
          srsi_k_buy: Phenotypes.RangeFactor(0.0, 40.0, 1.0),
          srsi_dType:  Phenotypes.ListOption(['SMA','EMA','WMA','DEMA','TEMA','TRIMA','KAMA','MAMA','T3']),



          bollinger_size: Phenotypes.RangeFactor(10, 25, 1),
          bollinger_time: Phenotypes.RangeFactor(0.5, 16.0, 0.1),
          bollinger_upper_bound_pct: Phenotypes.RangeFactor(0.0, 100.0, 1.0),
          bollinger_lower_bound_pct: Phenotypes.RangeFactor(0.0, 100.0, 1.0)
  
        }
}
