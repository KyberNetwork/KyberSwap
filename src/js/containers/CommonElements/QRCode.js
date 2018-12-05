import React from "react"
//import { connect } from "react-redux"
//import { push } from 'react-router-redux';

import { getTranslate } from 'react-localize-redux'
import QrReader from "react-qr-reader";
 
import { Modal } from '../../components/CommonElement'

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
            error: ""
        }
    }

    openModal = () => {
        this.setState({ isOpen: true, error: "" })
    }

    hideModal = () => {
        this.setState({ isOpen: false })
    }

    onError = (err) => {
        if (err) {
            this.setState({error: "Can not access your device camera"})
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
                data = data.substring(seperatorIndex + 1,)
                this.props.onScan(data)
            }
            this.hideModal()
        }
    }

    checkWebRTCCompatible = () => {
        return !!(navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia);
    }

    render() {
        var qcReader 
        if (this.checkWebRTCCompatible()) {
            qcReader =  <QrReader
            delay={300}
            onError={this.onError}
            onScan={this.onScan}
            style={{ width: "100%" }}
        />
        }else{
            qcReader = <span className="error">Your browser doesn't support scan QR Code</span>
        }
        var qcCode = (
            <div>
                <a className="x" onClick={(e) => this.hideModal(e)}>&times;</a>
                <div className="content with-overlap qc-code-wrapper">
                {qcReader}
                {this.state.error && (
                    <span className="error">{this.state.error}</span>
                )}
                </div>
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