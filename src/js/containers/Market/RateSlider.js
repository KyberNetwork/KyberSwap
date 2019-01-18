import React from "react"
import { connect } from "react-redux"
import Slider from "react-slick"


import { toT, roundingNumber } from "../../utils/converter"
import constants from "../../services/constants"


@connect((store) => {

  return {
    tokens: store.market.tokens
  }
})


export default class RateSilder extends React.Component {
  getPriceToken = (token) => {    
    if(token.ETH.buyPrice == 0 || token.ETH.sellPrice == 0){
      return token.ETH.buyPrice + token.ETH.sellPrice
    }else{
      return (token.ETH.buyPrice + token.ETH.sellPrice) / 2
    }
  }

  render() {    
    // var rateReverse
    var rates = []
    var token
    Object.keys(this.props.tokens).forEach((key) => {     
      var price = this.getPriceToken(this.props.tokens[key])      
      if (price != 0) {
        rates.push(
          <div key={key}>
            <div class="pair">{key} / ETH</div>
            <div class="value up">
              {roundingNumber(price)}
              <span class="percent-change">{this.props.tokens[key].ETH.change} %</span>
            </div>
            
          </div>
        )
      }
    })

    var settings = {
      infinite: true,
      arrows: false,
      autoplay: true,
      speed: 500,
      adaptiveHeight: true,
      variableWidth: true,
      responsive: [
        { breakpoint: 400, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 3 } },
        { breakpoint: 1024, settings: { slidesToShow: 5 } },
        { breakpoint: 100000, settings: { slidesToShow: 6 } }]
    }
    return (
      <div class="row small-11 medium-12 large-12" id="rate-bar">
        <div class="column">
          <div className="rate">
            <Slider {...settings}>
              {rates}
            </Slider>
          </div>
        </div>
      </div>
    )
  }
}

