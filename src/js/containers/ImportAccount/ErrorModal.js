import React from "react"
import { connect } from "react-redux"
import { ErrorModalView } from "../../components/ImportAccount"
import { closeErrorModal } from "../../actions/accountActions"
import { getTranslate } from 'react-localize-redux';

@connect((store) => {
  return { account: store.account,
    translate: getTranslate(store.locale),
    analytics: store.global.analytics
  }
})

export default class ErrorModal extends React.Component {
  closeModal = () => {
    this.props.dispatch(closeErrorModal())
    this.props.analytics.callTrack("trackClickCloseModal", "Error modal");
  }

  render() {
    return (
      <ErrorModalView
        isOpen={this.props.account.error.showError}
        onRequestClose={this.closeModal}
        title={this.props.title}
        error={this.props.account.error.error}
        translate={this.props.translate}
      />
    )
  }
}
