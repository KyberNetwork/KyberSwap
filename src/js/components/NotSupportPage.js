import React from "react"

export default class NotSupportPage extends React.Component {
  render() {
    return (
      <div class="not-support">
        Kyber Wallet currenly not support browser {this.props.client.name} - version {this.props.client.version} in {this.props.client.os}        
        <div class="sorry">Sorry for this inconvenience!</div>
      </div>
    )
  }
}
