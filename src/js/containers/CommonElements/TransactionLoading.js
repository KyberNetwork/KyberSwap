import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import constants from "../../services/constants"
import { TransactionLoadingView } from "../../components/Transaction"
import { getTranslate } from 'react-localize-redux'
import exchangeActions from "../../actions/exchangeActions"
import { Modal } from "../../components/CommonElement"


@connect((store, props) => {
    var returnProps = {}
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
            step: props.step
        }
    }
    return { ...returnProps, translate: getTranslate(store.locale) }
})

export default class TransactionLoading extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenModal: false,
            isCopied: false,
            step: props.step
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
    }

    resetCopy(){
        this.setState({
            isCopied: false
        })
    }

    closeModal = () => {
        this.setState({step:1})
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
            />
        return (
            <Modal
            className={{
              base: 'reveal medium',
              afterOpen: 'reveal medium'
            }}
            isOpen={this.state.step === 3}
            onRequestClose={this.closeModal}
            contentLabel="confirm modal"
            content={loadingView}
            size="medium"
          />
        )
    }
}