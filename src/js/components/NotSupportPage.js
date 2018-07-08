import React from "react"

export default class NotSupportPage extends React.Component {
  render() {
    return (
      <div className="not-support-page">
            Kyber Swap don't support {this.props.client.name} browser.
            We recommend using Kyber with Chrome browser. 
      </div>
    )
  }
}
