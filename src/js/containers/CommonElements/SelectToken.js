import React from "react"
import { connect } from "react-redux"
import { TokenSelect } from '../../components/CommonElement'
import { hideSelectToken } from "../../actions/utilActions"
import constants from "../../services/constants"
import { getTranslate } from 'react-localize-redux'
import { Modal, SelectTokenModal } from '../../components/CommonElement'
@connect((store, props) => {
  var modal = store.utils.tokenModal
  if (!!modal) {
    return {
      modalInfo: modal,
      tokens: store.tokens.tokens,
      chooseToken: props.chooseToken,
      translate: getTranslate(store.locale)
    }
  }
  else {
    return {
      modalInfo: {
        open: false
      },
      translate: getTranslate(store.locale)

    }
  }
})

export default class SelectToken extends React.Component {

  closeModal = (event) => {
    this.props.dispatch(hideSelectToken())
  }
  chooseToken = (event, symbol, address, type) => {
    this.props.chooseToken(symbol, address, type)
  }


  render() {
    return (
      <SelectTokenModal
          isOpen={this.props.modalInfo.open}
          onRequestClose={this.closeModal}
          type={this.props.modalInfo.type}
          tokens={this.props.tokens}
          chooseToken={this.chooseToken}
          selected={this.props.modalInfo.selected}
          closeModal={this.closeModal}
          translate={this.props.translate}
      />

    )
  }
}
