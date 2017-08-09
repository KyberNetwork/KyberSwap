import React from "react"
import { connect } from "react-redux"
import Dropzone from 'react-dropzone'

import { uploadKey, throwError } from "../../actions/importKeystoreActions"
import { addressFromKey } from "../../utils/keys"

@connect((store) => {
  return store.importKeystore
})
export default class DropFile extends React.Component {

  onDrop(files) {
    var file = files[0]
    var fileReader = new FileReader()
    fileReader.onload = (event) => {
      var keystring = event.target.result
      try {
        console.log("keystring: ", keystring)
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
    var keystring
    var message
    try {
      keystring = JSON.parse(this.props.keystring)
      message = <p className="file-name">
        Uploaded keystore file for address: <span>{keystring.address}</span>
        <i class="k-icon k-icon-cloud"></i>
      </p>
    } catch (e) {
      console.log(e)
      if (this.props.error != "") {
        message = <p className="file-name">
          {this.props.error}
        </p>
      } else {
        message = <p className="file-name">
          Upload a valid keystore file
          <i class="k-icon k-icon-cloud"></i>
        </p>
      }
    }
    //console.log(keystring)
    return (
      <Dropzone onDrop={this.onDrop.bind(this)}>
        {message}
      </Dropzone>)
  }
}
