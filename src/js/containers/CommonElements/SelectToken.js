import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import { TokenSelect } from '../../components/CommonElement'
import { hideSelectToken } from "../../actions/utilActions"
import constants from "../../services/constants"
import { Modal, SelectTokenModal } from '../../components/CommonElement'

@connect((store, props) => {
  var modal = store.utils.tokenModal
  if (!!modal) {
    return {
      modalInfo: modal,
      tokens: store.tokens,
      chooseToken: props.chooseToken
    }
  }
  else {
    return {
      modalInfo: {
        open: false
      }
    }
  }
  //return store.utils
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

      />

    )
  }
}
