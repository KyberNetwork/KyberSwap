import React from "react"
import { connect } from "react-redux"

import ImportAccountView from '../../components/ImportAccount/ImportAccountView'
import { ImportKeystore, ImportByDevice, ImportByPrivateKey, ErrorModal, ImportByMetamask} from "../ImportAccount"

@connect((store) => {
  return { ...store.account }
})

export default class ImportAccount extends React.Component {
  render() {
    return (
      <ImportAccountView
        firstKey={<ImportByMetamask />}
        secondKey={<ImportKeystore />}
        thirdKey={<ImportByDevice />}
        fourthKey={<ImportByPrivateKey />}
        errorModal={<ErrorModal />}
      />
    )
  }
}