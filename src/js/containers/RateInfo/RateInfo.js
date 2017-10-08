import React from "react"

import {ExchangeRates} from "../../components/ExchangeRates"
import { showRate, hideRate } from "../../actions/utilActions"
import { connect } from "react-redux"

@connect((store) => {
  return {
    utils: store.utils,    
    rates: store.global.rates
  }
})

export default class RateInfo extends React.Component {  
  hideRate = (event) => {
  	this.props.dispatch(hideRate())  	
  }	
  toggleRate = (event) => {
  	if(this.props.utils.rate){
  	  this.props.dispatch(hideRate())  		
  	}else{
  	  this.props.dispatch(showRate())  		
  	}
  }
  render() {
  	var classShow = this.props.utils.rate ? "k-rate k-rate-show":"k-rate";
	return (
		<div className={classShow}>
	        <div class="k-rate-wrapper" onClick={this.hideRate}></div>
	        <div class="k-rate-content">
	        	<button class="k-rate-btn" onClick={this.toggleRate}>
		          <i class="k-icon k-icon-rate-btn"></i>
		        </button>
		  		<div class="k-rate-info">
		  			<div class="title">
		  			  <div class="left">
		  			  	<i class="k-icon k-icon-exchange-orange"></i>
		  			  	Rates
		  			  </div>
		  			  <div class="right">
		  			  	<span onClick={this.hideRate}><i class="k-icon k-icon-close"></i></span>
		  			  </div>
		  			</div>
		  			<div class="rate-content">
		  			  <ExchangeRates rates = {this.props.rates}/>
		  			</div>		  			
		  		</div>      
	        </div>	        
	      </div>	  
	)
  }
}