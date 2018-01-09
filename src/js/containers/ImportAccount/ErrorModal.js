import React from "react"
import { connect } from "react-redux"
import { ErrorModalView } from "../../components/ImportAccount"
import { closeErrorModal } from "../../actions/accountActions"
import { getTranslate } from 'react-localize-redux';

@connect((store) => {
    return { ...store.account,
        translate: getTranslate(store.locale),
    }
})

export default class ErrorModal extends React.Component {
    closeModal = () => {
        this.props.dispatch(closeErrorModal())
    }

    render() {
        return (
            <ErrorModalView
                isOpen={this.props.showError}
                onRequestClose={this.closeModal}
                title={this.props.title}
                error={this.props.error}
                translate={this.props.translate}
            />
        )
    }
}