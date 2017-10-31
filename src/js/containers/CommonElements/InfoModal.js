import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import { InfoModal } from '../../components/CommonElement'
import { closeInfoModal} from "../../actions/utilActions"
@connect((store) => {
  var modal = store.utils.infoModal
  if (!!modal) {
    return {
      modal: modal
    }
  }
  else {
    return {
      modal: {
        open: false
      }
    }
  }
})

export default class Info extends React.Component {
  exitIdleMode = () => {
    this.props.dispatch(closeInfoModal())
  }

  render(){
    var processingModal = (
      <InfoModal />
    )
    return (
      <InfoModal 
          isOpen={this.props.modal.open}
          title={this.props.modal.title} 
          content={this.props.modal.content} 
          closeModal={this.exitIdleMode.bind(this)}
      />
    )  
  }
}
