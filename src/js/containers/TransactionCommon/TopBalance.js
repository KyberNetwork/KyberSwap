import React from "react"
import { connect } from "react-redux"

import * as converters from "../../utils/converter"
import { getTranslate } from "react-localize-redux";

@connect((store, props) => {

    return {
        account: store.account,
        global: store.global,
        exchange: store.exchange,
        transfer: store.transfer,
        showMore: props.showMore,
        tokens: store.tokens.tokens,
        chooseToken: props.chooseToken,
        activeSymbol: props.activeSymbol,
        screen: props.screen,
        changeAmount: props.changeAmount,
        changeFocus: props.changeFocus,
        ethereum: store.connection.ethereum,
        translate: getTranslate(store.locale)
    }
})

export default class TopBalance extends React.Component {

    selectBalance = (sourceSymbol) => {

        this.props.chooseToken(sourceSymbol, this.props.tokens[sourceSymbol].address, this.props.screen === "swap" ? "source" : "transfer")

        var sourceBalance = this.props.tokens[sourceSymbol].balance
        var sourceDecimal = this.props.tokens[sourceSymbol].decimals
        var amount

        if (sourceSymbol !== "ETH") {
            amount = sourceBalance
            amount = converters.toT(amount, sourceDecimal)
            amount = amount.replace(",", "")
        } else {
            var gasLimit
            var totalGas
            if (this.props.screen === "swap") {
                var destTokenSymbol = this.props.exchange.destTokenSymbol
                gasLimit = this.props.tokens[destTokenSymbol].gasLimit || this.props.exchange.max_gas
                totalGas = converters.calculateGasFee(this.props.exchange.gasPrice, gasLimit) * Math.pow(10, 18)
                // amount = (sourceBalance - totalGas) * percent / 100
            } else {
                gasLimit = this.props.transfer.gas
                totalGas = converters.calculateGasFee(this.props.transfer.gasPrice, gasLimit) * Math.pow(10, 18)
                // amount = (sourceBalance - totalGas) * percent / 100
            }
            amount = sourceBalance - totalGas * 120 / 100
            amount = converters.toEther(amount)
            amount = converters.roundingNumber(amount).toString(10)
            amount = amount.replace(",", "")
        }

        if (this.props.screen === "swap") {
            this.props.dispatch(this.props.changeAmount('source', amount))
            this.props.dispatch(this.props.changeFocus('source'));
        } else {
            this.props.dispatch(this.props.changeAmount(amount))
            // this.props.changeFocus()
        }
        this.props.selectTokenBalance();
        this.props.global.analytics.callTrack("trackClickToken", sourceSymbol, this.props.screen);
    }

    showMore = () => {
        this.props.showMore()
    }

    reorderToken = (tokens) => {
        return converters.sortEthBalance(tokens)
    }

    renderToken = (tokens) => {
        var isFixedSourceToken = !!(this.props.account && this.props.account.account.type ==="promo");
        var maxToken = 3
        var tokenLayout = tokens.slice(0, maxToken).map(token => {
            const classTokenItem = (isFixedSourceToken && this.props.screen === "swap") || (token.symbol === "PT" && this.props.screen === "transfer")
             ? "top-token-item--deactivated" : "";
            return <div className={`top-token-item ${classTokenItem} ${this.props.activeSymbol === token.symbol ? "active" : ""}`} key={token.symbol} onClick={(e) => { this.selectBalance(token.symbol) }}>
                <div className="top-token-item__symbol">{token.symbol}</div>
                <div className="top-token-item__balance">{converters.roundingNumber(converters.toT(token.balance, token.decimals))}</div>
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
                <div className="top-token-more" onClick={this.showMore}>{this.props.translate("market.more") || "more"}</div>
            </div>
        )
    }
}