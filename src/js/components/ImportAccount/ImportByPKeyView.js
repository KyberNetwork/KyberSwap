import React from "react"
import { Modal } from '../CommonElement'
import ReactTooltip from 'react-tooltip'

const ImportByPKeyView = (props) => {

	function handldeSubmit() {
		let privateKey = document.getElementById("private_key").value
		props.importPrivateKey(privateKey)
	}

	function submit(e) {
		if (e.key === 'Enter') {
			handldeSubmit(e)
		}
	}

	function toggleShowPw() {
		let input = document.getElementById('private_key')
		if (input.classList.contains('security')) {
			input.classList.remove('security')
			input.parentElement.classList.add('unlock')
		} else if (input.type == 'text') {
			input.classList.add('security')
			input.parentElement.classList.remove('unlock')
		}
	}

	return (
		<div className="column column-block">
			<div className="importer pkey">
				<div className="how-to-use" data-for="private-key-tip" data-tip="How to use"></div>
				<img src={require('../../../assets/img/landing/privatekey_active.svg')} />
				<div className="importer__name">PRIVATE KEY</div>
				<button className="importer__button" onClick={(e) => props.modalOpen()}>Connect</button>
				{/* <a onClick={() => props.modalOpen()} id="importPKey">
					<img src={require('../../../assets/img/pkey.svg')} />
				</a> */}
			</div>
			<ReactTooltip place="top" id="private-key-tip" type="dark" />

			<Modal
				className={{ base: 'reveal tiny', afterOpen: 'reveal tiny import-privatekey' }}
				isOpen={props.isOpen}
				onRequestClose={() => props.onRequestClose()}
				content={
					<div>
						<div className="title">{ props.translate("import.from_private_key_input_title") || "ENTER YOUR PRIVATE KEY"}</div><a className="x" onClick={props.onRequestClose}>&times;</a>
						<div className="content with-overlap">
							<div className="row">
								<div className="column">
									<center>
										<label className={!!props.pKeyError ? "error" : ""}>
											<div className="input-reveal">
												<input className="text-center security" id="private_key"
												type="text"
												onChange={(e) => props.onChange(e)}
												onKeyPress={(e) => submit(e)}
												value={props.privateKey}
												autoFocus
												autoComplete="off"
												spellCheck="false"
												required />
												<p>{props.privateKeyVisible}</p>
												<a className="toggle" onClick={toggleShowPw}></a>
												<a className="tootip"></a>
											</div>
											{!!props.pKeyError &&
												<span className="error-text">{props.pKeyError}</span>
											}
										</label>
									</center>
								</div>
							</div>
						</div>
						<div className="overlap">
							<button className="button accent cur-pointer" id="submit_pkey" onClick={() => handldeSubmit()} >{props.translate("modal.import") || "Import"}</button>
						</div>

					</div>
				}
			/>
		</div>
	)
}

export default ImportByPKeyView