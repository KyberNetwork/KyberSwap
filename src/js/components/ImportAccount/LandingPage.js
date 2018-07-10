import React from "react"
import TermAndServices from "../../containers/CommonElements/TermAndServices";
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
import config from '../../config';
import Web3Service from "../../services/web3"

import {acceptTermOfService} from "../../actions/globalActions"
import { importAccountMetamask } from "../../actions/accountActions"
import BLOCKCHAIN_INFO from "../../../../env"


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


	// clickCheckbox = () => {
	// 	this.setState({
	// 		termAgree: !this.state.termAgree
	// 	})
	// }

	acceptTerm = () => {
		// if (this.state.termAgree) {
		if (typeof web3 !== "undefined") {
			var web3Service = new Web3Service(web3)
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
	}

	render() {
		return (
			<div id="get-start">
				<div className="landing-background">
				</div>
				<div class="frame">
					<div className="container">
						<div className="convert-tokens">
              <div className="landing-page__container">
                <div className="landing-page__content">
                  <div className="landing-page__content-tagline">
                    <h1 className="landing-page__content-title">{this.props.translate("landing_page.instant_and_secure_token_swap") || "Instant and Secure Token to Token Swaps"}</h1>
                    <h2 className="landing-page__content-description">{this.props.translate("landing_page.no_oderbooks_no_deposit") || "No orderbooks, no deposits, pure joy."}</h2>
                    {/* <p className="landing-page__content-pr">Want to purchase different tokens without any hassle?<br/>Do it in a few simple clicks.</p> */}
                  </div>

                  <div className="landing-page__content-term">
                    <TermAndServices onClick={this.acceptTerm}/>                    
                  </div>
                </div>
                {/* <div className="landing-page__content">
                  <div className="landing-page__content-circle">
                    <img src={require("../../../assets/img/landing/token-wheel.svg")} />
                  </div>
                </div> */}
              </div>

							<div className="account-type">
								<div className="account-type__item">
									<div className="account-type__content">
										<img src={require("../../../assets/img/landing/metamask_disable.png")} />
										<div className="account-type__text">{this.props.translate("landing_page.metamask") || "METAMASK"}</div>
									</div>
								</div>
								<div className="account-type__item">
									<div className="account-type__content">
										<img src={require("../../../assets/img/landing/keystore_disable.png")} />
										<div className="account-type__text">{this.props.translate("landing_page.json") || "JSON"}</div>
									</div>
								</div>
								<div className="account-type__item">
									<div className="account-type__content">
										<img src={require("../../../assets/img/landing/trezor_disable.png")} />
										<div className="account-type__text">{this.props.translate("landing_page.trezor") || "TREZOR"}</div>
									</div>
								</div>
								<div className="account-type__item">
									<div className="account-type__content">
										<img src={require("../../../assets/img/landing/ledger_disable.png")} />
										<div className="account-type__text">{this.props.translate("landing_page.ledger") || "LEDGER"}</div>
									</div>
								</div>
								<div className="account-type__item">
									<div className="account-type__content">
										<img src={require("../../../assets/img/landing/privatekey_disable.png")} />
										<div className="account-type__text">{this.props.translate("landing_page.private_key") || "PRIVATE KEY"}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			// <div id="comming-soon">
			// 	<div className="notification">
			// 		<h1>kyberSwap</h1>
			// 		<h4>Coming Soon</h4>
			// 	</div>
			// 	<div className="notice">
			// 		<p>
			// 			In the meanwhile, please visit our existing exchange for swapping tokens.
			// 			<a href="https://kyber.network" target="_blank">https://kyber.network</a>
			// 		</p>
			// 	</div>
			// </div>
		)
	}
}
