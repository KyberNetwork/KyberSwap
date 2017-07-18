import React from "react"
import { connect } from "react-redux"
import Dropzone from 'react-dropzone'

import { uploadKey, throwError } from "../../actions/importKeystoreActions"
import { addressFromKey } from "../../utils/keys"

@connect((store) => {
  return store.importKeystore
})
export default class DropFile extends React.Component {
 constructor() {
            super();
            this.state = {
                files: [],              
            };           
        }
         onDrop(files) {
            this.setState({
                files: files
            });
            var file = files[0]
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
  // uploadKey = (event) => {
  //   var file = event.target.files[0]
  //   var fileReader = new FileReader()
  //   fileReader.onload = () => {
  //     var keystring = fileReader.result
  //     try {
  //       var address = addressFromKey(keystring)
  //       this.props.dispatch(uploadKey(
  //         address, keystring))
  //     } catch (e) {
  //       this.props.dispatch(throwError(e.message))
  //     }
  //   }
  //   try {
  //     fileReader.readAsText(file)
  //   } catch (e) {
  //   }
  // }

  render() {
    return (
    <Dropzone onDrop={this.onDrop.bind(this)}>
	   <p className="file-name">
	   {
	     this.state.files.map(f => <span key="file-name">{f.name} - {f.size} bytes</span>)
	  }
	   </p>
	 </Dropzone>)
  }
}
