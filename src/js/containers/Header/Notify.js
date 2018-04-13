import React from "react"
import { connect } from "react-redux"
import { NotifyView } from "../../components/Header"
import { clearTxs } from "../../actions/txActions"
import { toggleNotify } from '../../actions/utilActions'
import { analyzeError } from "../../actions/exchangeActions"
import constants from "../../services/constants"
import { getTranslate } from 'react-localize-redux';

@connect((store) => {
    return {
        txs: store.txs,
        utils: store.utils,
        translate: getTranslate(store.locale),
        ethereum: store.connection.ethereum,
    }
})

export default class Notify extends React.Component {

    // constructor(props) {
    //     super(props)

    //     this.toggleTxs = this.toggleTxs.bind(this);
    //     this.state = {
    //         dropdownOpen: false
    //     };
    // }

    // toggleTxs = () => {
    //     this.props.dispatch(toggleNotify())
    //     if (Object.keys(this.props.txs).length > 0) {
    //         if (this.props.utils.showNotify) {
    //             this.props.dispatch(clearTxs());
    //         }
    //     }
    // }


    displayTransactions = () => {
        
        if (Object.keys(this.props.txs).length > 0) {
         //   if (this.props.utils.showNotify) {
                this.props.dispatch(clearTxs());
          //  }
        }

      //  this.props.dispatch(toggleNotify())
    }

    handleAnalyzeError = (txHash) => {
        this.props.dispatch(analyzeError(this.props.ethereum, txHash))
    }

    render() {
        return (
            <NotifyView
                displayTransactions={this.displayTransactions}
                transactionsNum={Object.keys(this.props.txs).length}
               // displayTrans={this.props.utils.showNotify}
                txs={this.props.txs}
                translate={this.props.translate}
                handleAnalyze={this.handleAnalyzeError.bind(this)}
                //dropdownOpen={this.state.dropdownOpen}
                //'toggleTxs={this.toggleTxs}
            />
        )
    }
}