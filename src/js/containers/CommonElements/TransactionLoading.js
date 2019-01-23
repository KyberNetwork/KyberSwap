import React from "react"
import { connect } from "react-redux"
import { TransactionLoadingView } from "../../components/Transaction"
import { getTranslate } from 'react-localize-redux'
import { Modal } from "../../components/CommonElement"
import constansts from "../../services/constants"
import * as common from "../../utils/common"


@connect((store, props) => {
    var returnProps = {}
    var changePath
    if (props.type === "swap") {
        const transfer = store.transfer
        var transferLink = constansts.BASE_HOST + "/transfer/" + transfer.tokenSymbol.toLowerCase()
        changePath = common.getPath(transferLink, constansts.LIST_PARAMS_SUPPORTED)
    } else {
        const exchange = store.exchange
        var exchangeLink = constansts.BASE_HOST + "/swap/" + exchange.sourceTokenSymbol.toLowerCase() + "_" + exchange.destTokenSymbol.toLowerCase()
        changePath = common.getPath(exchangeLink, constansts.LIST_PARAMS_SUPPORTED)
    }
    if (props.broadcasting) {
        returnProps = {
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
          txHash: props.tx,
          analyze: props.analyze,
          address: props.address,
          isOpen: props.isOpen,
          changePath: changePath,
        }
    }
    return { ...returnProps, translate: getTranslate(store.locale), analytics: store.global.analytics }
})

export default class TransactionLoading extends React.Component {

    constructor() {
        super();
        this.state = {
            isOpenModal: false,
            isCopied: false,
        }
    }

    toogleModal() {
        this.setState({
            isOpenModal: !this.state.isOpenModal
        })
    }

    handleCopy() {
        this.setState({
            isCopied: true
        })
        this.props.analytics.callTrack("trackClickCopyTx");
    }

    resetCopy(){
        this.setState({
            isCopied: false
        })
    }
    render() {
        var loadingView =
          <TransactionLoadingView
            broadcasting={this.props.broadcasting}
            error={this.props.error}
            type={this.props.type}
            status={this.props.status}
            txHash={this.props.txHash}
            balanceInfo={this.props.balanceInfo}
            makeNewTransaction={this.props.makeNewTransaction}
            translate={this.props.translate}
            analyze={this.props.analyze}
            address={this.props.address}
            toogleModal={this.toogleModal.bind(this)}
            isOpenModal={this.state.isOpenModal}
            isCopied={this.state.isCopied}
            handleCopy={this.handleCopy.bind(this)}
            resetCopy={this.resetCopy.bind(this)}
            analytics = {this.props.analytics}
            changePath = {this.props.changePath}
          />
        return (
            <Modal
            className={{
              base: 'reveal medium transaction-loading',
              afterOpen: 'reveal medium transaction-loading'
            }}
            isOpen={this.props.isOpen}
            onRequestClose={this.props.makeNewTransaction}
            contentLabel="confirm modal"
            content={loadingView}
            size="medium"
          />
        )
    }
}
