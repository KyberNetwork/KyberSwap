import React from "react"
import { connect } from "react-redux"
import { closeOtherConnectModal } from "../../actions/accountActions"
import { getTranslate } from 'react-localize-redux'
import { Modal } from '../../components/CommonElement'
import {
  ImportByPrivateKey,
  ImportByWalletLink,
  ImportByWalletConnect,
  ImportKeystore
} from "../../containers/ImportAccount";

@connect((store) => {
  return {
    account: store.account,
    translate: getTranslate(store.locale),
    global: store.global
  }
})
export default class ImportByOtherConnectModal extends React.Component {
  closeModal() {
    this.props.dispatch(closeOtherConnectModal());
  }

  render() {
    const isOnMobile = this.props.global.onMobile.isIOS || this.props.global.onMobile.isAndroid;
    return (
      <div>
        <Modal
          className={{ base: 'reveal medium promocode', afterOpen: 'reveal medium import-promocode' }}
          isOpen={this.props.account.otherConnect.modalOpen}
          onRequestClose={this.closeModal.bind(this)}
          content={
            <div>
              <div className="content with-overlap theme__background-2">
                <div className="title">
                  {this.props.translate("import.connect_other_wallet") || "Connect other wallet"}
                </div>
                <div className={`import-account__content ${isOnMobile ? ' import-account__content--mobile' : ''}`}>
                  <div className={`import-account__item large`}>
                    <ImportByWalletLink closeParentModal={this.closeModal.bind(this)} tradeType={this.props.account.otherConnect.tradeType}/>
                  </div>
                  <div className={`import-account__item large`}>
                    <ImportByWalletConnect closeParentModal={this.closeModal.bind(this)} tradeType={this.props.account.otherConnect.tradeType}/>
                  </div>
                  <div className={`import-account__item large`}>
                    <ImportKeystore closeParentModal={this.closeModal.bind(this)} />
                  </div>
                  <div className={`import-account__item large`}>
                    <ImportByPrivateKey isOnMobile={isOnMobile} closeParentModal={this.closeModal.bind(this)} tradeType={this.props.account.otherConnect.tradeType}/>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>
    )
  }
}
