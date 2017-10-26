import React from "react"
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { Rate, Address, Notify } from "../Header"

@connect((store) => {
  return {txs: store.txs}
})

export default class Header extends React.Component {
  
	render() {
    // const transactionsNum = Object.keys(this.props.txs).length;    
    return (
      
        <div>
          {/* <div>Icon</div>
          <Rate />
          <Address />
          <Notify /> */}

          <section id="header">
            <div class="row">
              <div class="column small-5 medium-6 large-7 hide-for-small-only">
              <Link to="/" className="logo">
                <img src="/assets/img/logo.svg"/>
              </Link>
                {/* <a class="logo" href="/">
                  
                </a> */}
              </div>
              <div class="column small-12 medium-6 large-5">
                <div class="user-bar">
                  <div class="row">
                    <Address path={this.props.location.pathname}/>  
                    <Notify />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="rate-bar">
            <Rate />
          </section>

        </div> 
    )
  }
}
