import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import { InfoModal } from '../../components/CommonElement'
import { closeInfoModal} from "../../actions/utilActions"
import { getTranslate } from 'react-localize-redux'
import * as analytics from "../../utils/analytics"

@connect((store) => {
  var modal = store.utils.infoModal
  return {
    modal: modal ? modal : { open: false, },
    translate: getTranslate(store.locale)
  }
})

export default class Info extends React.Component {
  exitIdleMode = () => {
    this.props.dispatch(closeInfoModal())
    analytics.trackClickCloseModal("Info Modal")
  }

  render(){
    return (
      <InfoModal 
          isOpen={this.props.modal.open}
          title={this.props.modal.title} 
          translate={this.props.translate} 
          content={this.props.modal.content} 
          closeModal={this.exitIdleMode.bind(this)}          
      />
    )  
  }
}
