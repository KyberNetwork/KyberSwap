import React from "react"

import Dropzone from 'react-dropzone'
//import ReactTooltip from 'react-tooltip'
import { getAssetUrl } from "../../utils/common";


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

      {({ getRootProps, getInputProps, isDragActive }) => {
        return (
          // <div className={"importer json"} {...getRootProps()}>
          //   <input {...getInputProps()} />
          //   <div className={"importer__symbol"}>
          //     <div className={"importer__icon keystore"}/>
          //     <div className={"importer__name"}>{props.translate("import.json") || "Keystore"}</div>
          //   </div>
          // </div>

          <div className="importer json" {...getRootProps() }>
            <input {...getInputProps() } />
            <div className="importer__symbol">
              <img src={getAssetUrl('wallets/keystore.svg')} />
              <div className="importer__name">{props.translate("import.json") || "JSON"}</div>
            </div>
            <button className="importer__button" onClick={(e) => props.onDrop(e)}>{props.translate("import.select_or_drag") || "Select or Drag"}</button>
          </div>

        )
      }}

      {/* <div className="importer json">
        <div className="importer__symbol">
          <img src={getAssetUrl('wallets/keystore.svg')} />
          <div className="importer__name">{props.translate("import.json") || "JSON"}</div>
        </div>
        <button className="importer__button" onClick={(e) => props.onDrop(e)}>{props.translate("import.select_or_drag") || "Select or Drag"}</button>
      </div> */}
    </Dropzone>
  )
}

export default DropFile
