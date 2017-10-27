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
            <div class="column small-5 medium-6 large-7 hide-for-small-only">
              <Link to="/info" className="logo">
                <img src="/assets/img/logo.svg" />
              </Link>
            </div>
            <div class="column small-7 medium-6 large-5">
              <div class="text-right">
                <div class="user-bar">
                  <div class="row">
                    <Address path={this.props.location.pathname} />
                    { this.props.account.address ? <Notify /> : '' }
                  </div>
                </div>
              </div>
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
