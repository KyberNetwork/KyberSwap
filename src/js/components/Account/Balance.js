import React from "react"
import { toT } from "../../utils/converter"


export class Balance extends React.Component {
  render() {
    return (
      <div>
        <p>Ether balance: {toT(this.props.balance)} (wei)</p>
      </div>
    )
  }
}

export class Nonce extends React.Component {
  render() {
    return (
      <div>
        <p>Nonce: {this.props.nonce}</p>
      </div>
    )
  }
}

export class Token extends React.Component {
  render() {
    return (
      <div class="token-item">
        <div class="avatar">
          <img src={this.props.icon} />
        </div>
        <div class="name">
          {this.props.name}
        </div>
        <label>Balance</label>
        <div class="value" title={toT(this.props.balance)}>
          {toT(this.props.balance, 8)}
        </div>
      </div>
    )
  }
}
