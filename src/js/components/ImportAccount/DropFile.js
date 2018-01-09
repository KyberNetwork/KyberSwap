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
  //console.log(keystring)
  return (
    <Dropzone onDrop={props.onDrop} disablePreview={true} className="column column-block">
      <div className="importer json">
        <a ><img src={require('../../../assets/img/json.svg')}/>
          <div className="description">{props.translate("import.from_keystore") || <span>Select or drag<br />your keystore</span>}</div>
        </a>
      </div>
      {message}
    </Dropzone>
  )  
}

export default DropFile