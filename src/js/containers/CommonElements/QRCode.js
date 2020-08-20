import React from "react"
import QrReader from "react-qr-reader";
import { Modal } from '../../components/CommonElement'
import {checkBrowser, isMobile} from "../../utils/common"

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
      this.setState({ isBlock: true })
      if (this.props.onError) {
        this.props.onError(err)
      }
    }
  }

  onScan = (data) => {
    if (data) {
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
    var isIOS = !!isMobile.iOS()
    var isAndroid = !!isMobile.Android()
    var isNotGerneralInfo = isIOS && checkBrowser.isSafari() || isAndroid && checkBrowser.isFirefox() || isAndroid && checkBrowser.isChrome()
    var msgContent = ""
    if (isIOS && checkBrowser.isSafari()) msgContent = <span>Refresh website and try again</span>
    if (isAndroid && checkBrowser.isFirefox()) msgContent = <span>Close this modal and try again</span>
    if (isAndroid && checkBrowser.isChrome()) msgContent = <div className="qc-nav-bar"><span>Settings</span>  <span>Advanced</span>  <span>Site Settings</span> <span>Camera</span> <span>Unblock Kyber</span></div>

    return (
      <div className="qc-error">
        {isNotGerneralInfo && <h2>Follow steps to allow KyberSwap to access your camera</h2>}
        {!isNotGerneralInfo && <h2>KyberSwap cannot access your camera</h2>}
        {isNotGerneralInfo && msgContent}
      </div>
    )
  }

  isSupported = () => {
    if (!this.checkWebRTCCompatible() || (this.state.isBlock && this.props.onDAPP) || (!!isMobile.iOS() && checkBrowser.isSafari())) return false
    if (this.checkWebRTCCompatible()) return true
  }

  render() {
    var isSupported = this.isSupported()    
    var qcReader = isSupported ? <QrReader delay={300} onError={this.onError} onScan={this.onScan} style={{ width: "100%" }} /> : <span className="error">Your browser doesn't support scan QR Code</span>

    var qcCode = (
      <div className="qc-modal">
        {isSupported && (
          <div>
            <div className="x" onClick={(e) => this.hideModal(e)}>&times;</div>
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
            <div className="x" onClick={(e) => this.hideModal(e)}>&times;</div>
            <div className="content with-overlap qc-code-wrapper">
              {qcReader}
            </div>
          </div>
        )}
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
    )
  }
}
