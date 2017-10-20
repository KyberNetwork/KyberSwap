import React from "react"
import { connect } from "react-redux"

import {DropFile} from "../../components/ImportAccount"
import { saveKeyStore, throwError } from "../../actions/importAccountActions"
import { verifyKey, anyErrors } from "../../utils/validators"
import { addressFromKey } from "../../utils/keys"

@connect((store) => {
  return {...store.account}
})

export default class ImportLedger extends React.Component {

  render() {
    return (
      <div>
        
      </div>
    )
  }
}
