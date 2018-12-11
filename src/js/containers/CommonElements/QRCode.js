import React from "react"
//import { connect } from "react-redux"
//import { push } from 'react-router-redux';

import { getTranslate } from 'react-localize-redux'
import QrReader from "react-qr-reader";

import { Modal } from '../../components/CommonElement'
import {checkBrowser, isMobile} from "../../utils/common"

// @connect((store) => {
//   return {
//     account: store.account,
//     translate: getTranslate(store.locale)
//   }
// })

export default class QRCode extends React.Component {
    constructor() {
        super()
        this.state = {
            isOpen: false,
            isBlock: false
        }
    }

    openModal = () => {
        this.setState({ isOpen: true, isBlock: false })
    }

    hideModal = () => {
        this.setState({ isOpen: false })
    }

    onError = (err) => {
        if (err) {
            //this.setState({error: "Click on 3 dots at top right corner >> Settings >> Advanced >> Site Settings >> Camera >>  Unblock Kyber"})
            this.setState({ isBlock: true })
            if (this.props.onError) {
                this.props.onError(err)
            }
        }
    }

    onScan = (data) => {
        if (data) {
            // console.log("scan_data")
            // console.log(data)
            // alert(data)
            if (this.props.onScan) {
                //handle raw data
                var seperatorIndex = data.indexOf(":")
                data = data.substring(seperatorIndex + 1, )
                this.props.onScan(data)
            }
            this.hideModal()
        }
    }

    checkWebRTCCompatible = () => {
        return !!(navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia);
    }

    blockCameraMsg = () => {
        if (checkBrowser.isNotFCSBrowser()) {
            return (
                <div className="qc-error">
                    <h2>KyberSwap cannot access your camera</h2>
                </div>
            )
        }

        return (
            <div className="qc-error">
                <h2>Follow steps to allow KyberSwap access your camera</h2>
                {isMobile.iOS() && checkBrowser.isSafari() && <span>Refresh website and try again</span>}
                {isMobile.Android() && checkBrowser.isFirefox() && <span>Close this modal and try again</span>}
                {isMobile.Android() && checkBrowser.isChrome() && <div className="qc-nav-bar"><span>Settings</span>  <span>Advanced</span>  <span>Site Settings</span> <span>Camera</span> <span>Unblock Kyber</span></div>}
            </div>
        )
    }

    render() {
        var qcReader
        var isSupported = true
        if (this.checkWebRTCCompatible()) {
            qcReader = <QrReader
                delay={300}
                onError={this.onError}
                onScan={this.onScan}
                style={{ width: "100%" }}
            />
        } else {
            qcReader = <span className="error">Your browser doesn't support scan QR Code</span>
            isSupported = false
        }
        var qcCode = (
            <div className="qc-modal">
                {isSupported && (
                    <div>
                        <a className="x" onClick={(e) => this.hideModal(e)}>&times;</a>
                        {!this.state.isBlock && (
                            <div className="qc-title">
                                <h2>Scan the code</h2>
                            </div>
                        )}
                        {this.state.isBlock ? 
                            this.blockCameraMsg()
                        : ''}
                        <div className="content with-overlap qc-code-wrapper">
                            {qcReader}
                        </div>
                        {this.state.isBlock && (
                            <div className="cancel-qc-btn" onClick={this.hideModal}>Cancel Scanning</div>
                        )}
                    </div>
                )}

                {!isSupported && (
                    <div>
                        <a className="x" onClick={(e) => this.hideModal(e)}>&times;</a>
                        <div className="content with-overlap qc-code-wrapper">
                            {qcReader}
                        </div>
                    </div>
                )}
                {/* {this.state.error && (
                    <span className="error">{this.state.error}</span>
                )} */}

            </div>
        )
        return (
            <div className="qc-code-content">
                <span onClick={this.openModal}>
                    <img src={require("../../../assets/img/qr-code.svg")} />
                </span>

                <Modal
                    className={
                        {
                            base: 'reveal tiny',
                            afterOpen: 'reveal tiny'
                        }}
                    content={qcCode}
                    isOpen={this.state.isOpen}
                    onRequestClose={this.hideModal}
                    size="tiny"
                    contentLabel=""
                />
            </div>
            //     <QrReader
            //     delay={300}
            //     onError={this.props.onError}
            //     onScan={this.props.onScan}
            //     style={{ width: "100%" }}
            //   />
        )
    }
}