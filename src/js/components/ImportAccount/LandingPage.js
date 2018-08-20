import React from "react"
import TermAndServices from "../../containers/CommonElements/TermAndServices";
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
import config from '../../config';
import Web3Service from "../../services/web3"

import {acceptTermOfService} from "../../actions/globalActions"
import { importAccountMetamask } from "../../actions/accountActions"
import BLOCKCHAIN_INFO from "../../../../env"
import * as analytics from "../../utils/analytics"


@connect((store, props) => {
	var tokens = store.tokens.tokens
	var supportTokens = []
	Object.keys(tokens).forEach((key) => {
		supportTokens.push(tokens[key])
	})

	return {
		translate: getTranslate(store.locale),
		ethereum: store.connection.ethereum,
		tokens: supportTokens,
	}
})

export default class LandingPage extends React.Component {

	constructor() {
		super()
		this.state = {
			termAgree: false,
			text: ''
		}
	}

	componentDidMount() {
		let textArr = ['Decentralized', 'Trustless', 'Instant', 'Liquid', 'Compatible']
		this.typeIt(textArr)
	}

	componentWillUnmount() {
		clearInterval(this.SI);
		clearTimeout(this.ST);
	}

	typeIt(words) {
		let letterIndex = 0;
		let wordIndex = 0;

		let nextWord = () => {
			let h1 = ''
			this.SI = setInterval(() => {
				h1 += words[wordIndex][letterIndex]
				this.setState({
					text: h1
				})
				letterIndex++;
				if (letterIndex === words[wordIndex].length) {
					wordIndex = (wordIndex + 1) % words.length;
					letterIndex = 0;
					clearInterval(this.SI);
					this.ST = setTimeout(() => {
						nextWord();
					}, 2000);
				}
			}, 150);
		}
		nextWord();
	}

	acceptTerm = () => {
		// if (this.state.termAgree) {
		var web3Service = new Web3Service()
		
		if (web3Service.isHaveWeb3()) {
			var walletType = web3Service.getWalletType()
			if (walletType !== "metamask") {
				//alert(walletType)
				this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
				this.props.ethereum, this.props.tokens, this.props.translate, walletType))
			}else{
				this.props.dispatch(acceptTermOfService())
			}
		}else{
			this.props.dispatch(acceptTermOfService())
		}		
		// }
		analytics.acceptTerm()
	}

  render() {
    return (
      <div id="get-start">
        <div className="accept-term">
          <TermAndServices onClick={this.acceptTerm}/>
        </div>

        <div className="account-type">
          <div className="account-type__item">
            {this.props.translate("landing_page.metamask") || "Metamask"}
          </div>
          <div className="account-type__item">
            {this.props.translate("landing_page.json") || "JSON"}
          </div>
          <div className="account-type__item">
            {this.props.translate("landing_page.trezor") || "Trezor"}
          </div>
          <div className="account-type__item">
            {this.props.translate("landing_page.ledger") || "Ledger"}
          </div>
          <div className="account-type__item">
            {this.props.translate("landing_page.private_key") || "Private Key"}
          </div>
        </div>
      </div>
    )
  }
}
