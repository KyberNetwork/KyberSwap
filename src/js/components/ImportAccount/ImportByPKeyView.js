import React from "react"
import { Modal } from '../CommonElement'

const ImportByPKeyView = (props) => {

	function handldeSubmit(e) {
		e.preventDefault()
		props.importPrivateKey()
	}

	return (
		<div class="column column-block">
			<div class="importer pkey">
				<a onClick={() => props.modalOpen()}>
						<img src="/assets/img/pkey.svg" />
						<div class="description">Enter your<br />private key</div>
				</a>
			</div>

			<Modal
				className={{ base: 'reveal tiny', afterOpen: 'reveal tiny' }}
				isOpen={props.isOpen}
				onRequestClose={() => props.onRequestClose()}
				content={
					<div>
						<div class="title">ENTER YOUR PRIVATE KEY</div><a class="x" onClick={props.onRequestClose}>&times;</a>
						{/* <form onSubmit={(e) => handldeSubmit(e)}></form> */}
						<div class="content with-overlap">
							<div class="row">
								<div class="column">
									<center>
										<label className={!!props.pKeyError ? "error" : ""}>
											<input class="text-center" type="password" id="private_key" onChange={(e) => props.onChange(e)}
											 placeholder="Enter your private key" required autoComplete="off" />
											{!!props.pKeyError &&
													<span className="error-text">{props.pKeyError}</span>
											}
										</label>
									</center>
								</div>
							</div>
						</div>
						<span className="error-text">kjsjdhfkjsdfk</span>
						<div class="overlap">
								<button class="button accent" onClick={(e) => handldeSubmit(e)} >Import</button>
						</div>
							
					</div>
				}
			/>
		</div>
	)
}

export default ImportByPKeyView