import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import DropFile from "./Elements/DropFile"

import { specifyName, specifyDesc, emptyForm } from "../actions/importKeystoreActions"
import { addAccount } from "../actions/accountActions"

@connect((store) => {
  return {...store.importKeystore}
})
export default class ImportKeystore extends React.Component {
  specifyName = (event) => {
    this.props.dispatch(specifyName(event.target.value))
  }

  specifyDesc = (event) => {
    this.props.dispatch(specifyDesc(event.target.value))
  }

  importAccount = (event) => {
    event.preventDefault()
    this.props.dispatch(addAccount(
      this.props.address, this.props.keystring,
      this.props.name, this.props.desc))
    this.props.dispatch(emptyForm())
  }

  render() {
    return (
      <div>
        <h2>Import JSON Keystore file</h2>
        <form>
          <label>
            Account name:
            <input value={this.props.name} onChange={this.specifyName} type="text" />
          </label>
          <DropFile address={this.props.address}/>
          <p>Associate address: {this.props.address}</p>
          <p>Error: {this.props.error}</p>
          <button class="button" onClick={this.importAccount}>Add account</button>
        </form>
      </div>
    )
  }
}
