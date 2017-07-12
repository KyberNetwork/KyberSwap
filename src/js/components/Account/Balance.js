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
      <div class="token-item grid-container">
        <div class="grid-x grid-padding-x">
          <div class="token-logo large-4 cell">
            <img src={this.props.icon} />
          </div>
          <div class="token-name large-4 cell">
            {this.props.name}
          </div>
          <div class="token-quantity large-4 cell">
            {this.props.balance}
          </div>
        </div>
      </div>
    )
  }
}
