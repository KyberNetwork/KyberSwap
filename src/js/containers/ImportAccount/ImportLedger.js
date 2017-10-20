import React from "react"
import { connect } from "react-redux"

import { scanLedger } from "../../actions/importAccountActions"
import { verifyKey, anyErrors } from "../../utils/validators"
import { addressFromKey } from "../../utils/keys"


const defaultEtherDPath = "m/44'/60'/0'";
@connect((store) => {
  return {...store.account}
})


export default class ImportLedger extends React.Component {
  
  scanLedger = () => {    
    console.log("------ import ledger click-----");
    this.props.dispatch(scanLedger(defaultEtherDPath))
  }

  render() {
    return (
      <div>
        <p> import ledger </p>
        <p>DPath: "{defaultEtherDPath}"</p>
        <button type="button" onClick={this.scanLedger}>Scan Ledger</button>
      </div>
    )
  }
}
