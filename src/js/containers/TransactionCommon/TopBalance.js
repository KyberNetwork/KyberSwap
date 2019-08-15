import React from "react"
import { connect } from "react-redux"
import * as converters from "../../utils/converter"
import { getTranslate } from "react-localize-redux";
import { getPendingBalances } from "../../actions/limitOrderActions";

@connect((store, props) => {
    return {
        account: store.account,
        global: store.global,
        exchange: store.exchange,
        transfer: store.transfer,
        showMore: props.showMore,
        tokens: store.tokens.tokens,
        // chooseToken: props.chooseToken,
        activeSymbol: props.activeSymbol,
        screen: props.screen,
        // changeAmount: props.changeAmount,
        // changeFocus: props.changeFocus,
        ethereum: store.connection.ethereum,
        translate: getTranslate(store.locale),
        limitOrder: store.limitOrder
    }
})

export default class TopBalance extends React.Component {

    // selectBalance = (sourceSymbol) => {
    //     this.props.chooseToken(sourceSymbol, this.props.tokens[sourceSymbol].address, "source")

    //     var sourceBalance = this.props.tokens[sourceSymbol].balance

    //     if (this.props.isLimitOrderTab) {
    //         const tokens = this.props.getFilteredTokens();
    //         const srcToken = tokens.find(token => {
    //           return token.symbol === sourceSymbol;
    //         });
    //         sourceBalance = srcToken.balance;
    //     }

    //     var sourceDecimal = this.props.tokens[sourceSymbol].decimals
    //     var amount

    //     if (sourceSymbol !== "ETH") {
    //         amount = sourceBalance
    //         amount = converters.toT(amount, sourceDecimal)
    //         amount = amount.replace(",", "")
    //     } else {
    //         var gasLimit
    //         var totalGas
    //         if (this.props.screen === "swap") {
    //             var destTokenSymbol = this.props.exchange.destTokenSymbol
    //             gasLimit = this.props.tokens[destTokenSymbol].gasLimit || this.props.exchange.max_gas
    //             totalGas = converters.calculateGasFee(this.props.exchange.gasPrice, gasLimit) * Math.pow(10, 18)
    //             // amount = (sourceBalance - totalGas) * percent / 100
    //         } else if (this.props.screen === "limit_order") { 
    //             const destTokenSymbol = this.props.limitOrder.destTokenSymbol;
    //             gasLimit = this.props.tokens[destTokenSymbol].gasLimit || this.props.limitOrder.max_gas;
    //             totalGas = converters.calculateGasFee(this.props.limitOrder.gasPrice, gasLimit) * Math.pow(10, 18)
    //         } else {
    //             gasLimit = this.props.transfer.gas
    //             totalGas = converters.calculateGasFee(this.props.transfer.gasPrice, gasLimit) * Math.pow(10, 18)
    //             // amount = (sourceBalance - totalGas) * percent / 100
    //         }
    //         amount = sourceBalance - totalGas * 120 / 100
    //         amount = converters.toEther(amount)
    //         amount = converters.roundingNumber(amount).toString(10)
    //         amount = amount.replace(",", "")
    //     }

    //     if (amount < 0) amount = 0;

    //     if (this.props.screen === "swap" || this.props.screen === "limit_order") {
    //         this.props.dispatch(this.props.changeAmount('source', amount))
    //         this.props.dispatch(this.props.changeFocus('source'));
    //     } else {
    //         this.props.dispatch(this.props.changeAmount(amount))
    //         // this.props.changeFocus()
    //     }
    //     this.props.selectTokenBalance();
    //     this.props.global.analytics.callTrack("trackClickToken", sourceSymbol, this.props.screen);
    // }

    showMore = () => {
        this.props.showMore()
    }

    // reorderToken = (tokens, maxItemNumber) => {
    //     const orderedTokens = converters.sortEthBalance(tokens);
    //     return orderedTokens.slice(0, maxItemNumber)
    // }

    componentDidMount() {
        if (this.props.account && this.props.screen === "limit_order") {
            this.props.dispatch(getPendingBalances(this.props.account.account.address));
        }
    }

    renderToken = (tokens) => {
        var isFixedSourceToken = !!(this.props.account && this.props.account.account.type ==="promo");
        let isAnyTokenActive = false;

        var tokenLayout = this.props.orderedTokens.map(token => {
            const classTokenItem = (isFixedSourceToken && this.props.screen === "swap") 
            || (token.symbol === "PT" && this.props.screen === "transfer")
             ? "top-token-item--deactivated" : "";
            const isTokenActive = this.props.activeSymbol === token.symbol;
            if (isTokenActive) isAnyTokenActive = true;
             
            return <div className={`top-token-item ${classTokenItem} ${isTokenActive ? "active" : ""}`} key={token.symbol} onClick={(e) => { this.props.selectToken(token.symbol) }}>
                <div className="top-token-item__symbol">{token.substituteSymbol ? token.substituteSymbol : token.symbol}</div>
                <div className="top-token-item__balance">{converters.roundingNumber(converters.toT(token.balance, token.decimals))}</div>
            </div>
        })
      return <div className={`top-token-content ${!isAnyTokenActive ? 'top-token-content--bold' : ''}`}>{tokenLayout}</div>
    }

    render() {
        return (
            <div className="top-token">
                {this.renderToken(this.props.tokens)}
                <div className="top-token-more" onClick={this.showMore}>{this.props.translate("market.more") || "more"}</div>
            </div>
        )
    }
}
