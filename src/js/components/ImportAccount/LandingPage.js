import React from "react"
import TermAndServices from "../../containers/CommonElements/TermAndServices";

export default class LandingPage extends React.Component {

	constructor(){
		super()
		this.state = {
			termAgree: false
		}
	}

	clickCheckbox = () => {
		this.setState({
			termAgree: !this.state.termAgree
		})
	}

	goExchange = () => {
		if(this.state.termAgree){
			this.props.goExchange()
		}
	}

	render(){
		return (
			<div id="get-start">
					<div class="frame">
							<div className="row">
									<div className="column text-center">
											<h3 class="title">{this.props.translate("landing_page.title") || "Decentralized Exchange  for Ethereum tokens"}</h3>
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