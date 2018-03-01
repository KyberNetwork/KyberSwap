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
		if (this.state.termAgree) {
			this.props.goExchange()
		}
	}

	render() {
		return (
			<div id="get-start">
				<div class="frame">
					<div className="row">
						<div className="column text-center">
							<h3 class="title">
								<span>{this.state.text}</span> 
								<span class="flag"> 
									<img src={require('../../../assets/img/kyber-flag.svg')}/>
									<span> exchange </span><br/>
									<span>for Cryptocurrencies</span>
								</span>
							</h3>
							<TermAndServices
								termAgree={this.state.termAgree}
								clickCheckbox={this.clickCheckbox}
							/>
							<button class={"button accent " + (this.state.termAgree ? "next" : "disable")}
								onClick={this.goExchange}>
								{this.props.translate("landing_page.get_started") || "Get Started"}
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}