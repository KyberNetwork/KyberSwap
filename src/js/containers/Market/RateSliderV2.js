import React from "react"
import { connect } from "react-redux"
// import Slider from "react-slick"


import { toT, roundingNumber } from "../../utils/converter"
import constants from "../../services/constants"


function getPriceToken(token) {
    if (token.ETH.buyPrice == 0 || token.ETH.sellPrice == 0) {
        return token.ETH.buyPrice + token.ETH.sellPrice
    } else {
        return (token.ETH.buyPrice + token.ETH.sellPrice) / 2
    }
}

@connect((store) => {
    // get array tokens
    var tokens = store.market.tokens
    var listTokens = []
    Object.keys(tokens).forEach((key) => {
        var price = getPriceToken(tokens[key])
        if (price != 0) {
            listTokens.push(tokens[key])
        }
    })
    return {
        listTokens
    }
})


export default class RateSilderV2 extends React.Component {
    constructor() {
        super()
        this.state = {
            numDisplay: 7,
            page: 0,
            intervalUpdatePage: false,
            intervalTime: 7000
        }
    }

    componentDidMount = () => {
        if(window.innerWidth < 992){
            this.setState({
                numDisplay: 5
            })
        }
        this.intervalUpdatePage = setInterval(() => {
            this.increasePage()
        }, this.state.intervalTime)
    }

    componentWillUnmount = () => {
        clearInterval(this.intervalUpdatePage)
        this.intervalUpdatePage = false
    }

    clickIncreasePage = () => {
        this.increasePage()
        clearInterval(this.intervalUpdatePage)
        this.intervalUpdatePage = setInterval(() => {
            this.increasePage()
        }, this.state.intervalTime)
    }

    increasePage = () => {
        if (this.state.page >= this.props.listTokens.length / this.state.numDisplay - 1) {
            this.setState({
                page: 0
            })
        } else {
            this.setState({
                page: this.state.page + 1
            })
        }
    }

    // getPriceToken = (token) => {
    //     if (token.ETH.buyPrice == 0 || token.ETH.sellPrice == 0) {
    //         return token.ETH.buyPrice + token.ETH.sellPrice
    //     } else {
    //         return (token.ETH.buyPrice + token.ETH.sellPrice) / 2
    //     }
    // }
    getListDisplay = () => {
        var currentPage = this.state.page
        var listDisplay = []
        var listTokens = this.props.listTokens
        //console.log(listTokens)
        for (var i = currentPage * this.state.numDisplay; i < (currentPage + 1) * this.state.numDisplay; i++) {
            if (i < listTokens.length) {
                if (listTokens[i]) listDisplay.push(listTokens[i])
            } else {
                if (listTokens[i - listTokens.length]) listDisplay.push(listTokens[i - listTokens.length])
            }
        }
        return listDisplay
    }

    render() {
        var listDisplay = this.getListDisplay()
        //console.log(listDisplay)
        var rateContent = listDisplay.map((value, index) => {
            var rateChange = value.ETH.change
            var symbol = value.info.symbol
            var price = getPriceToken(value)
            return (
                <div key={symbol+index}>
                    <div className="rate-item">
                        {rateChange > 0 && rateChange != -9999 && (
                            <div className="change-positive rate-item__percent-change"></div>
                        )}
                        {rateChange < 0 && rateChange != -9999 && (
                            <div className="change-negative rate-item__percent-change"></div>
                        )}
                        <div>
                            <div class="pair">{symbol}</div>
                            <div class="value up">
                                {roundingNumber(price)}
                            </div>
                            <div class="percent-change">{rateChange === -9999 ? "---" : Math.abs(rateChange)} %</div>
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <div id="rate-bar">
                <div className="rate" onClick={this.clickIncreasePage}>
                    {rateContent}
                </div>
            </div>
        )
    }
}

