import React from "react"
import { connect } from "react-redux"

import { uploadKey, throwError } from "../../actions/importKeystoreActions"
import { addressFromKey } from "../../utils/keys"

@connect((store) => {
  return store.importKeystore
})
export default class Key extends React.Component {

  uploadKey = (event) => {
    var file = event.target.files[0]
    var fileReader = new FileReader()
    fileReader.onload = () => {
      var keystring = fileReader.result
      try {
        var address = addressFromKey(keystring)
        this.props.dispatch(uploadKey(
          address, keystring))
      } catch (e) {
        this.props.dispatch(throwError(e.message))
      }
    }
    try {
      fileReader.readAsText(file)
    } catch (e) {
    }
  }

  render() {
    return (
    <label>
      Upload your key file:
      <input type="file" onChange={this.uploadKey}/>
    </label>)
  }
}
