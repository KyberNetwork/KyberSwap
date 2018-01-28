import React from "react"

import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'

import InfoKyber from "../../components/InfoKyber"
import { Modal } from '../../components/CommonElement'

@connect((store) => {
  return {
    translate: getTranslate(store.locale)
  }
})

export default class InfoModal extends React.Component {

  constructor(){
    super()
    this.state = {
      isOpen: false
    }
  }

  closeModal = (event) => {
    this.setState({isOpen : false})
  }

  openModal = () => {
    this.setState({isOpen : true})
  }

  content = () => {
    return (
      <InfoKyber closeModal={this.closeModal}/>      
    )
  }

  render() {
    return (
      <React.Fragment>
        <a onClick={(e) => this.openModal(e)}>{this.props.translate("footer.info") || "Info"}</a>

        <Modal className={{
          base: 'reveal medium',
          afterOpen: 'reveal medium'
        }}
          isOpen={this.state.isOpen}
          onRequestClose={this.closeModal}
          contentLabel="Info kyber"
          content={this.content()}
          size="large"
        />
      </React.Fragment>

    )
  }
}
