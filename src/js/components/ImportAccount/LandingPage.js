import React from "react"
import TermAndServices from "../../containers/CommonElements/TermAndServices";
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';

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


	clickCheckbox = () => {
		this.setState({
			termAgree: !this.state.termAgree
		})
	}

	goExchange = () => {
		// if (this.state.termAgree) {
		this.props.goExchange()
		// }
	}

	render() {
		return (
			<div id="get-start">
				<div class="frame">
					<div className="row">
						<div className="convert-tokens">
							<div>
								<h1>Instant and Secure Token Swaps.<br></br>No orderbooks, no deposits, pure joy.</h1>
								<p>Want to purchase different tokens without any hassle? Do it in a few simple clicks.</p>
							</div>

							<div className="accept-term">
								<TermAndServices
									termAgree={this.state.termAgree}
									clickCheckbox={this.clickCheckbox}
								/>
								<div className="accept-btn">
									<button class={"button"}
										onClick={this.goExchange}>
										ACCEPT
									</button>
								</div>
							</div>

							<div className="account-type grid-x">
								<div className="item small-4 medium-4 large-2 columns">
									<div>
										<div>
										<img src="../../../assets/img/landing/metamask_disable.png" />
										<span>METAMASK</span>
										</div>
									</div>

								</div>
								<div className="item small-4 medium-4 large-2 columns">
									<div>
									<div>
										<img src="../../../assets/img/landing/keystore_disable.png" />
										<span>KEYSTORE</span>
										</div>
									</div>
								</div>
								<div className="item small-4 medium-4 large-2 columns">
									<div>
									<div>
										<img src="../../../assets/img/landing/trezor_disable.png" />
										<span>TREZOR</span>
										</div>
									</div>
								</div>
								<div className="item small-4 medium-4 large-2 columns">
									<div>
									<div>
										<img src="../../../assets/img/landing/ledger_disable.png" />
										<span>LEDGER</span>
										</div>
									</div>
								</div>
								<div className="item small-4 medium-4 large-2 columns">
									<div>
									<div>
										<img src="../../../assets/img/landing/privatekey_disable.png" />
										<span>PRIVATE KEY</span>
										</div>
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
