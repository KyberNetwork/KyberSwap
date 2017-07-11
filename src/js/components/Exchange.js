import React from "react"
import ExchangeForm from "./ExchangeForm"


export default class Exchange extends React.Component {
  render() {
    return (
    <div>
      <h2>Exchange</h2>
      <ExchangeForm passphraseID="exchange-passphrase" />
    </div>)
  }
}
