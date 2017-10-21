import React from "react"
import { connect } from "react-redux"

import { ImportKeystore, ImportTrezor, ImportLedger } from "../ImportAccount"

@connect((store) => {
  return {...store.account}
})

export default class ImportAccount extends React.Component {
	render() {
		return (
			<div>
				<h1>Add an address</h1>
				<ImportKeystore />
				<ImportTrezor />
				<ImportLedger />
			</div>
		)
	}
}