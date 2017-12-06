import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import constants from "../../services/constants"
import { TransactionLoadingView } from "../../components/Transaction"
import { getTranslate } from 'react-localize-redux'

@connect((store, props) => {
    var returnProps = {}
    if (props.broadcasting) {
        returnProps =  { 
            broadcasting: true, 
            error: ""
        }
    } else if (props.broadcastingError !== "") {
        returnProps = { broadcasting: true, error: props.broadcastingError }
    } else {
        returnProps = {
            ...props.tempTx, 
            broadcasting: false,
            makeNewTransaction: props.makeNewTransaction,
            type: props.type,
            balanceInfo: props.balanceInfo,
            txHash: props.tx
        }
    }
    return {...returnProps, translate: getTranslate(store.locale)}
})

export default class TransactionLoading extends React.Component {
    render() {
        return (
            <TransactionLoadingView
                broadcasting={this.props.broadcasting}
                error={this.props.error}
                type={this.props.type}
                status={this.props.status}
                txHash={this.props.txHash}
                balanceInfo={this.props.balanceInfo}
                makeNewTransaction={this.props.makeNewTransaction}
                translate={this.props.translate}
            />

        )
    }
}