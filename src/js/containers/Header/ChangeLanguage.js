import React from "react"

import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import { showLangugaModal } from "../../actions/utilActions"
import { getLanguage } from "../../services/language"
import { supportLanguage } from '../../../../lang'
import { changeLanguage } from "../../actions/globalActions"

import InfoKyber from "../../components/InfoKyber"
import { Modal } from '../../components/CommonElement'

@connect((store) => {
  return {
    ethereumNode: store.connection.ethereum,
    utils: store.utils,
    translate: getTranslate(store.locale)
  }
})


export default class InfoModal extends React.Component {

  constructor() {
    super()
    this.state = {
      isOpen: false
    }
  }

  closeModal = (event) => {
    this.setState({ isOpen: false })
  }

  openModal = () => {
    this.setState({ isOpen: true })
  }

  setActiveLanguage = (language) => {
    this.props.dispatch(changeLanguage(this.props.ethereumNode, language))
    this.closeModal()
  }

  content = () => {
    let translate = this.props.translate
    return (
      <div className="language-list">
        <div class="title">{translate("modal.select_your_language") || "Select your language"}</div><a className="x" onClick={this.closeModal}>&times;</a>
        <div class="content">
          <div class="row tokens">
            {
              supportLanguage.map(lang => (
                <div class="column small-6 medium-4" key={lang}>
                  <button className={'token-stamp width-f '
                    + (translate('pack') == lang ? 'selected ' : '')
                    + (getLanguage(lang).pack_active ? '' : 'empty')
                  }
                    disabled={getLanguage(lang).pack_active ? false : true}
                    onClick={() => { this.setActiveLanguage(lang) }}
                  >
                    <img src={require('../../../assets/img/langs/' + getLanguage(lang).pack_icon)} />
                    <span class="name">{getLanguage(lang).pack_label}</span>
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }

  render() {
    var lang = this.props.translate('pack')
    return (
      <React.Fragment>
        <a onClick={() => this.openModal()}>
          <img src={require('../../../assets/img/langs/' + getLanguage(lang).pack_icon)} />
          <span className="ml-2 language-name">{getLanguage(lang).pack_label}</span>
        </a>

        <Modal className={{
          base: 'reveal medium',
          afterOpen: 'reveal medium'
        }}
          isOpen={this.state.isOpen}
          onRequestClose={this.closeModal}
          contentLabel="select language"
          content={this.content()}
          size="large"
        />
      </React.Fragment>

    )
  }
}
