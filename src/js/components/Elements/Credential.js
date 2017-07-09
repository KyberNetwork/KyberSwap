import React from "react";


export default class Credential extends React.Component {
  render() {
    console.log('passphraseID: ', this.props.passphraseID)
    return (
      <div>
        <label>
          Please enter your passphrase:
          <input id={this.props.passphraseID} type="password"/>
        </label>
      </div>
    )
  }
}
