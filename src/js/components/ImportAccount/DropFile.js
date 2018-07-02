import React from "react"

import Dropzone from 'react-dropzone'
//import ReactTooltip from 'react-tooltip'

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
    <Dropzone onDrop={(e) => props.onDrop(e)} disablePreview={true} className="column column-block">
      <div className="importer json">
        {/* <div className="how-to-use" data-for="keystore-tip" data-tip="How to use"></div> */}
        <div className="importer__symbol">
          <img src={require('../../../assets/img/landing/keystore_active.svg')} />
          <div className="importer__name">{props.translate("import.json") || "JSON"}</div>
        </div>
        <button className="importer__button" onClick={(e) => props.onDrop(e)}>{props.translate("import.select_or_drag") || "Select or Drag"}</button>
      </div>
      {/* <ReactTooltip place="top" id="keystore-tip" type="dark" /> */}
    </Dropzone>
  )  
}

export default DropFile
