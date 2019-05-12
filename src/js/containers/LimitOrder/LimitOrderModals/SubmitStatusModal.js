import React from "react"
import { Modal } from "../../../components/CommonElement"

import constants from "../../../services/constants"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'


@connect((store, props) => {
    const account = store.account.account
    const translate = getTranslate(store.locale)
    const tokens = store.tokens.tokens
    const limitOrder = store.limitOrder
    const ethereum = store.connection.ethereum

    return {
        translate, limitOrder, tokens, account, ethereum

    }
})

export default class SubmitStatusModal extends React.Component {

    
  
    closeModal = () => {
        this.props.dispatch(limitOrderActions.resetOrderPath())
    }

    contentModal = () => {
        return (
            <div className="approve-modal">
            <div className="title">Status</div>
            <a className="x" onClick={(e) => this.props.closeModal(e)}>&times;</a>
            <div className="content with-overlap">
              <div className="row">
                
                Your order have been submitted sucessfully to server. You can check the order in your order list.
              </div>
            </div>
            
          </div>
        )
      }
    
    render() {
        return (
        <Modal className={{
            base: 'reveal medium confirm-modal',
            afterOpen: 'reveal medium confirm-modal'
          }}
            isOpen={this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.submitStatusOrder}
            onRequestClose={this.closeModal}
            contentLabel="status modal"
            content={this.contentModal()}
            size="medium"
          />
        )


    }
}
