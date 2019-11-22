import React from "react"
import Modal from 'react-modal'
import * as common from "../../utils/common"
import {connect} from "react-redux";
import {getTranslate} from "react-localize-redux";

@connect((store) => {
    return { theme: store.global.theme }
})
export default class MyModal extends React.Component{
    constructor() {
        super();
        this.state = {
            prevPropsIsOpen: false
        };
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
            if (props.isOpen){ common.addCloseModalExecutors(props.onRequestClose) }
            else { common.removeCloseModalExecutors(props.onRequestClose) }

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
              <div className={`theme theme--${this.props.theme}__bundle theme__text`}>
                  <div className="theme__background theme__text custom-modal">
                    {this.props.content}
                  </div>
              </div>
          </Modal>
        )
    }
}