import React from "react"
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
              <div class="column small-5 medium-6 large-7">
                <a class="logo" href="/">
                  <img src="/assets/img/logo.svg"/>
                </a>
              </div>
              <div class="column small-7 medium-6 large-5">
                <div class="user-bar">
                  <div class="row">
                    <div class="column small-2"><a class="avatar" href="/exchange.html"><img src="/assets/img/address.png"/></a></div>
                    <Address />  
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
