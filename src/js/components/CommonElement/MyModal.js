import React from "react"
import Modal from 'react-modal'
import * as common from "../../utils/common"

export default class MyModal extends React.Component{
    state = {
        prevPropsIsOpen: false
    };
    constructor() {
        super();
        this.customStyles = {
            overlay: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(11, 15, 26, 0.6)',
                zIndex: '1005',
                overflowY: 'auto'
            },
            content: {
                display: 'block',
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.isOpen !== state.prevPropsIsOpen) {
            if (props.isOpen){ common.addModalClose(props.onRequestClose) }
            else { common.removeModalClose(props.onRequestClose) }

            return {
                prevPropsIsOpen: props.isOpen
            };
        }
        return null;
    }

    render(){
        return (
          <Modal
            className={{
                base: this.props.className.base + " react-modal",
                afterOpen: this.props.className.afterOpen + ' modal-open',
                beforeClose:""
            }}
            overlayClassName={this.props.overlayClassName ? this.props.overlayClassName : ''}
            style={this.customStyles}
            isOpen={this.props.isOpen}
            onRequestClose={this.props.onRequestClose}
            contentLabel={this.props.contentLabel}
          >
              {this.props.content}
          </Modal>
        )
    }
}