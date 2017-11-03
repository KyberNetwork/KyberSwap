import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
//import Key from "./Elements/Key"
//import { TokenSelect } from '../../components/Token'
import constants from "../../services/constants"
import { TransactionLoadingView } from "../../components/CommonElement"

@connect((store, props) => {
    if (props.broadcasting) {
        return { broadcasting: true, error: "" }
    } else {
        if (props.broadcastingError !== "") {
            return { broadcasting: true, error: props.broadcastingError }
        }
        return {
            ...props.tempTx, broadcasting: false
            , makeNewTransaction: props.makeNewTransaction
            , type: props.type
            , balanceInfo: props.balanceInfo
            , txHash: props.tx
        }
    }
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
            />

        )
    }
}