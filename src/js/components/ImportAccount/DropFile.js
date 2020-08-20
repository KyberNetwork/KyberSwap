import React from "react"
import Dropzone from 'react-dropzone'

const DropFile = (props) => {
  var keystring
  var message
  try {
    if (props.keystring) {
      keystring = JSON.parse(props.keystring)
      message = <p className="file-name">
        Uploaded keystore file for address: <span>{keystring.address}</span>
        <i class="k-icon k-icon-cloud"></i>
      </p>
    }
  } catch (e) {
    console.log(e)
    if (props.error != "") {
      message = <p className="file-name">
        {props.error}
      </p>
    } else {
      message = <p className="file-name">
        Upload a valid keystore file
        <i class="k-icon k-icon-cloud"></i>
      </p>
    }
  }

  return (
    <Dropzone onDrop={(e) => props.onDrop(e)} disablePreview={true} className="column column-block">

      {({ getRootProps, getInputProps, isDragActive }) => {
        return (
          <div className="import-account__block theme__import-button" {...getRootProps() }>
            <input {...getInputProps() } />          
            <div className="import-account__icon json"/>
            <div className="import-account__name">{props.translate("import.json") || "KEYSTORE"}</div>
          </div>
        )
      }}
    </Dropzone>
  )
}

export default DropFile
