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
      <div>
        <p>Token name: {this.props.name}</p>
        <p>Token balance: {this.props.balance}</p>
        <p>Token icon: {this.props.icon}</p>
      </div>
    )
  }
}
