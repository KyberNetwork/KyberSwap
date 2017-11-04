import React from "react"
import { connect } from "react-redux"

import ImportAccountView from '../../components/ImportAccount/ImportAccountView'
import { ImportKeystore, ImportByDevice, ErrorModal } from "../ImportAccount"

@connect((store) => {
	return { ...store.account }
})

export default class ImportAccount extends React.Component {
	render() {
		return (
			<ImportAccountView
				importKeyStore={<ImportKeystore />}
				importByDevice={<ImportByDevice />}
				errorModal={<ErrorModal />}
			/>
		)
	}
}