import React from "react";


export class Balance extends React.Component {
  render() {
    return (
      <div>
        <p>Ether: {this.props.balance} (wei)</p>
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
        <div class="value text-gradient">
          {this.props.balance}
        </div>
      </div>
    )
  }
}
