import React from "react"
import TermAndServices from "../../containers/CommonElements/TermAndServices";
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
import config from '../../config';

import {acceptTermOfService} from "../../actions/globalActions"
@connect((store, props) => {
	return {
		translate: getTranslate(store.locale)
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
		this.props.dispatch(acceptTermOfService())
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
                    <h1 className="landing-page__content-title">Instant and Secure<br/>Token Swaps.</h1>
                    <h2 className="landing-page__content-description">No orderbooks, no deposits, pure joy.</h2>
                    <p className="landing-page__content-pr">Want to purchase different tokens without any hassle?<br/>Do it in a few simple clicks.</p>
                  </div>

                  <div className="landing-page__content-term">
                    <TermAndServices onClick={this.acceptTerm}/>                    
                  </div>
                </div>
                <div className="landing-page__content">
                  <div className="landing-page__content-circle">
                    <img src={require("../../../assets/img/landing/token-wheel.svg")} />
                  </div>
                </div>
              </div>

							<div className="account-type">
								<div className="account-type__item">
									<div className="account-type__content">
										<img src={require("../../../assets/img/landing/metamask_disable.png")} />
										<div className="account-type__text">METAMASK</div>
									</div>
								</div>
								<div className="account-type__item">
									<div className="account-type__content">
										<img src={require("../../../assets/img/landing/keystore_disable.png")} />
										<div className="account-type__text">KEYSTORE</div>
									</div>
								</div>
								<div className="account-type__item">
									<div className="account-type__content">
										<img src={require("../../../assets/img/landing/trezor_disable.png")} />
										<div className="account-type__text">TREZOR</div>
									</div>
								</div>
								<div className="account-type__item">
									<div className="account-type__content">
										<img src={require("../../../assets/img/landing/ledger_disable.png")} />
										<div className="account-type__text">LEDGER</div>
									</div>
								</div>
								<div className="account-type__item">
									<div className="account-type__content">
										<img src={require("../../../assets/img/landing/privatekey_disable.png")} />
										<div className="account-type__text">PRIVATE KEY</div>
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
