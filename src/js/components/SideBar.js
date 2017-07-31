import React from "react"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import * as _ from "underscore"

import NodeSwitch from "./NodeSwitch"

@connect((store) => {
  var pendingTxs = _.where(store.txs, { status: "pending" })
  return {
    path: store.router.location.pathname,
    pendingTxs: pendingTxs,
  }
})
export default class SideBar extends React.Component {

  tabClasses = (url) => {
    return url == this.props.path ? "tabs-title is-active" : "tabs-title"
  }

  render() {
    return (
      <div class="k-header">
        <div class="k-header-logo">
          <img src="assets/logo_icon.png" />
        </div>
        <div class="k-header-menu" id="menu">
          <ul class="tabs vertical" data-tabs>
            {/*
            <li class={this.tabClasses("/exchange")}>
              <Link to="/contracts">
                <i class="k-icon k-icon-contract"></i> Contracts
              </Link>
            </li>
            */}
            <li class={this.tabClasses("/")}>
              <Link to="/" >
                <i class="k-icon k-icon-account"></i> Accounts
              </Link>
            </li>
            <li class={this.tabClasses("/transactions")}>
              <Link to="/transactions">
                <i class="k-icon k-icon-transaction"></i> Transactions
              </Link>
            </li>
            <li class={this.tabClasses("/info")}>
              <Link to="/info">
                <i class="k-icon k-icon-info"></i> Information
              </Link>
            </li>
          </ul>
          <NodeSwitch />
        </div>
        <div class="k-header-pendding-tx">
          <div class={this.props.pendingTxs.length != 0 ? "loading" : ""} >
            <div class="number">0{this.props.pendingTxs.length}</div>
            <div class="pending">pending</div>
          </div>
          <div>Transactions</div>
          <div class="loading-icon">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" xmlSpace="preserve">
              <rect x="0" y="0" width="4" height="7" fill="#333" transform="scale(1 2.16074)">
                <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0s" dur="0.6s" repeatCount="indefinite"></animateTransform>       
              </rect>

              <rect x="10" y="0" width="4" height="7" fill="#333" transform="scale(1 1.17259)">
                <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.2s" dur="0.6s" repeatCount="indefinite"></animateTransform>       
              </rect>
              <rect x="20" y="0" width="4" height="7" fill="#333" transform="scale(1 2.50592)">
                <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.4s" dur="0.6s" repeatCount="indefinite"></animateTransform>       
              </rect>
            </svg>
          </div>
        </div>
      </div>
    )
  }
}
