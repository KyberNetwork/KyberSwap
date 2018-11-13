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

  return (
    <Dropzone onDrop={(e) => props.onDrop(e)} onClick={(e) => props.onDrop(e)} disablePreview={true} className="column-block">
      <div className="importer json">
        <div className="importer__symbol">
          {/* <img src={require('../../../assets/img/landing/keystore_active.svg')} /> */}
          <img src={getAssetUrl('wallets/keystore.svg')} />
          <div className="importer__name">{props.translate("import.json") || "JSON"}</div>
        </div>
        <div className="importer__button">{props.translate("import.select_or_drag") || "Select or Drag"}</div>
      </div>
    </Dropzone>
  )  
}

export default DropFile
