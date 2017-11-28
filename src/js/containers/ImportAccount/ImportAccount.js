import React from "react"
import { connect } from "react-redux"

import ImportAccountView from '../../components/ImportAccount/ImportAccountView'
import { ImportKeystore, ImportByDevice, ImportByPrivateKey, 
  ErrorModal, ImportByMetamask,
  ImportByDeviceWithLedger, ImportByDeviceWithTrezor
} from "../ImportAccount"

@connect((store) => {
  return { ...store.account }
})

export default class ImportAccount extends React.Component {
  render() {
    return (
      <ImportAccountView
        importKeyStore={<ImportKeystore />}
        // importByDevice={<ImportByDevice />}
        importByPrivateKey={<ImportByPrivateKey />}
        importByMetamask={<ImportByMetamask />}
        errorModal={<ErrorModal />}
        importByTrezor={<ImportByDeviceWithTrezor/>}
        importByLedger={<ImportByDeviceWithLedger/>}
        
      />
    )
  }
}