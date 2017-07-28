import React from "react"

import ExchangeRates from "../components/ExchangeRates"
import { showRate, hideRate } from "../actions/utilActions"
import { connect } from "react-redux"

@connect((store) => {
  return {
    utils: store.utils,    
  }
})

export default class RateInfo extends React.Component {
  showRate = (event) => {
  	this.props.dispatch(showRate())  	
  }	
  hideRate = (event) => {
  	this.props.dispatch(hideRate())  	
  }	
  render() {
  	var classShow = this.props.utils.rate ? "k-rate k-rate-show":"k-rate";
	return (
		<div className={classShow}>
	        <div class="k-rate-wrapper" onClick={this.hideRate}></div>
	        <div class="k-rate-content">
	        	<button class="k-rate-btn" onClick={this.showRate}>
		          <span>
		            Rates
		          </span>
		          <span>..</span>
		        </button>
		  		<div class="k-rate-info">
		  			<div class="title">
		  			  <div class="left">
		  			  	<i class="k-icon k-icon-lr-arrow"></i>
		  			  	Rates
		  			  </div>
		  			  <div class="right">
		  			  	<span onClick={this.hideRate}><i class="k-icon k-icon-close"></i></span>
		  			  </div>
		  			</div>
		  			<div class="rate-content">
		  			  <ExchangeRates />
		  			</div>		  			
		  		</div>      
	        </div>	        
	      </div>	  
	)
  }
}