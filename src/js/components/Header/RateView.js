import React from "react"
import Slider from "react-slick"


import { toT, roundingNumber } from "../../utils/converter"
import constants from "../../services/constants"

const ExchangeRates = (props) => {

  var rates = []
  var rateSymbol
  var rate
  // var rateReverse
  Object.keys(props.rates).forEach((key) => {
    rateSymbol = key
    if (rateSymbol.toLowerCase() == 'eth') return;
    rate = props.rates[rateSymbol]
    if (rate) {
      rates.push(
        <div key={rateSymbol}>
          <div class="pair">{rate.symbol} / ETH</div>
          <div class="value up">{roundingNumber(toT(rate.rate))}</div>
        </div>
      )
    }
  })

  var settings = {
    infinite: true,
    arrows: false,
    autoplay: true,
    speed: 500,
    pauseOnHover: true,
    adaptiveHeight: true,
    variableWidth: true,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 400, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 100000, settings: { slidesToShow: 6 } }]
  }
  return (
    <div class="row small-11 medium-12 large-12">
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
export default ExchangeRates

