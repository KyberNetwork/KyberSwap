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
		this.props.goExchange()
	}

	render() {
		return (
			<div id="get-start">
				<div class="frame">
					<div className="row">
						<div className="convert-tokens">
							<h1>Convert Tokens Instantly</h1>
							<p>No deposit, No registration</p>
							<button onClick={this.goExchange}>Swap now</button>
						</div>
						<div className="group">
							<img src={require('../../../assets/img/landing/group.svg')} />
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
