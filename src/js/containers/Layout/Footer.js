import React from "react"
import { connect } from "react-redux"
// import { TokenSelect } from '../../components/CommonElement'
import { hideLangugaModal, showLangugaModal } from "../../actions/utilActions"
import constants from "../../services/constants"
import { Modal } from '../../components/CommonElement'
import { Link } from 'react-router-dom'
import { getTranslate } from 'react-localize-redux'
import { changeLanguage } from "../../actions/globalActions"
@connect((store) => {
  return {
    ethereumNode: store.connection.ethereum,
    utils: store.utils,
    translate: getTranslate(store.locale)
  }

})

export default class Footer extends React.Component {

  closeModal = (event) => {
    this.props.dispatch(hideLangugaModal())
  }

  openLanguageModal = () => {
    this.props.dispatch(showLangugaModal())
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
            <div class="column small-6 medium-4">
              <button className={'token-stamp width-f ' + 
                (translate('pack') == 'en' ? 'selected' : '')}
                onClick={() => { this.setActiveLanguage('en') }}
              >
                <img src={"/assets/img/langs/uk.svg"} /><span class="name">English</span>
              </button>
            </div>
            <div class="column small-6 medium-4">
              <button disabled className={"token-stamp width-f empty"} 
                onClick={() => { this.setActiveLanguage('vi') }}
              >
                <img src={"/assets/img/langs/cn.svg"} /><span class="name">China</span>
              </button>
            </div>
            <div class="column small-6 medium-4 end">
              <button disabled className={"token-stamp width-f empty"} onClick={() => { this.setActiveLanguage('fr') }}>
                <img src={"/assets/img/langs/kr.svg"} /><span class="name">Korea</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  scrollTop = () => {
    window.scrollTo(0, 0)
  }
  render() {
    return (
      <div class="row">
        <div class="column">
          <ul class="links">
            <li>
              <Link to="/info" onClick={() => this.scrollTop()}>
                {this.props.translate("footer.info") || "Info"}
              </Link>
            </li>
            <li>
              <a onClick={() => this.openLanguageModal()}>
                {this.props.translate("footer.language") || "Language"}
              </a>
            </li>
          </ul>
        </div>
        <Modal className={{
          base: 'reveal medium',
          afterOpen: 'reveal medium'
        }}
          isOpen={this.props.utils.langModal?true:false}
          onRequestClose={this.closeModal}
          contentLabel="select language"
          content={this.content()}
          size="large"
        />
      </div>

    )
  }
}
