import React from "react"
import { connect } from "react-redux"
import { NotifyView } from "../../components/Header"
import { clearTxs } from "../../actions/txActions"
import { toggleNotify } from '../../actions/utilActions'
import constants from "../../services/constants"
import { getTranslate } from 'react-localize-redux';

@connect((store) => {
    return {
        txs: store.txs,
        utils: store.utils,
        translate: getTranslate(store.locale)
    }
})

export default class Notify extends React.Component {

    displayTransactions = () => {
        this.props.dispatch(toggleNotify())
        if (Object.keys(this.props.txs).length > 0) {
            if (this.props.utils.showNotify) {
                this.props.dispatch(clearTxs());
            }
        }

    }

    render() {
        return (
            <NotifyView displayTransactions={this.displayTransactions}
                transactionsNum={Object.keys(this.props.txs).length}
                displayTrans={this.props.utils.showNotify}
                txs={this.props.txs}
                translate={this.props.translate}    
            />
        )
    }
}