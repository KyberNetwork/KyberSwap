import React from "react"
import { connect } from "react-redux"

import { ImportKeystore, ImportByDevice, ErrorModal } from "../ImportAccount"

@connect((store) => {
	return { ...store.account }
})

export default class ImportAccount extends React.Component {
	render() {
		return (
			<div class="frame">
				<div className="row">
					<div class="column small-11 large-10 small-centered">
						<h1 class="title">Import address</h1>
						<div class="row">
							<div class="small-12 medium-4 column" style={{padding: 0}}>
								<ImportKeystore />
							</div>
							<div class="small-12 medium-8 column" style={{padding: 0}}>
								<ImportByDevice />
							</div>
						</div>
					</div>
				</div>
				<ErrorModal />
			</div>
		)
	}
}