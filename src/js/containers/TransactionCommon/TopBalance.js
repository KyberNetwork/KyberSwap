import React from "react"
import { connect } from "react-redux"

import * as converts from "../../utils/converter"
@connect((store, props) => {

    return {
        global: store.global,
        showMore: props.showMore,
        tokens: store.tokens.tokens,
        selectToken: props.selectToken,
        activeSymbol: props.activeSymbol
    }
})

export default class TopBalance extends React.Component {
    showMore = () => {
        this.props.showMore()
    }

    reorderToken = (tokens) => {
        return converts.sortEthBalance(tokens)
    }

    renderToken = (tokens) => {
        var maxToken = this.props.global.isOnMobile ? 3 : 4
        var tokenLayout = tokens.slice(0, maxToken).map(token => {
            return <div className={`top-token-item ${this.props.activeSymbol === token.symbol ? "active" : ""}`} key={token.symbol} onClick={(e) => { this.props.selectToken(token.symbol, token.address, "source") }}>
                <div className="top-token-item__symbol">{token.symbol}</div>
                <div className="top-token-item__balance">{converts.roundingNumber(converts.toT(token.balance, token.decimals))}</div>
            </div>
        })
        return tokenLayout
    }

    render() {
        //select top 4 balances
        var newTokens = this.reorderToken(this.props.tokens)

        return (
            <div className="top-token">
                <div className="top-token-content">{this.renderToken(newTokens)}</div>
                <div className="top-token-more" onClick={this.showMore}>More</div>
            </div>
        )
    }
}