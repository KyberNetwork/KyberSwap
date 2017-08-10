import React from "react"

export default class NotSupportPage extends React.Component {
  render() {
    return (
      <div class="not-support">
        Kyber Wallet currently does not support browser {this.props.client.name} - version {this.props.client.version} in {this.props.client.os}. Please try with Safari or Firefox.
        <div class="sorry">Sorry for this inconvenience!</div>
      </div>
    )
  }
}
