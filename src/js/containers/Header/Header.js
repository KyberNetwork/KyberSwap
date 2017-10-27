import React from "react"
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { Rate, Address, Notify } from "../Header"

@connect((store) => {
  return { 
    txs: store.txs,
    account: store.account.account
  }
})

export default class Header extends React.Component {

  render() {
    // console.log($('body').html())
    return (

      <div>
        <section id="header">
          <div class="row">
            <div class="column small-4 medium-6 large-7 hide-for-small-only">
              <Link to="/info" className="logo">
                <img src="/assets/img/logo.svg" />
              </Link>
            </div>
            <div class="column small-12 medium-6 large-5">
              <Address path={this.props.location.pathname}/>  
              {/* <Notify /> */}
            </div>
          </div>
        </section>

        <section id="rate-bar" style={{minHeight: 81}}>
          <Rate />
        </section>

      </div>
    )
  }
}
