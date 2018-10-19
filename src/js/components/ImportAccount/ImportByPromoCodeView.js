import React from "react"
import { Modal } from '../CommonElement'
import * as analytics from "../../utils/analytics"
//import ReactTooltip from 'react-tooltip'

const ImportByPromoCodeView = (props) => {

	function handldeSubmit() {
		let privateKey = document.getElementById("promo_code").value
		props.importPrivateKey(privateKey)
		analytics.trackClickSubmitPrKey()
	}

	function submit(e) {
		if (e.key === 'Enter') {
			importPromocode(e)
		}
	}

	// function toggleShowPw() {
	// 	let input = document.getElementById('promo_code')
	// 	if (input.classList.contains('security')) {
	// 		input.classList.remove('security')
	// 		input.parentElement.classList.add('unlock')
	// 		analytics.trackClickShowPassword("show")
	// 	} else if (input.type == 'text') {
	// 		input.classList.add('security')
	// 		input.parentElement.classList.remove('unlock')
	// 		analytics.trackClickShowPassword("hide")
	// 	}
	// }

	function importPromocode(){
		let privateKey = document.getElementById("promo_code").value		
		props.importPrivateKey(privateKey)
		analytics.trackClickSubmitPrKey()
	}
	return (
		<div className="column column-block">
			<div className="promo-content">
				<input placeholder={props.translate("import.enter_promo_code")|| "Enter your Promo Code here"} id="promo_code"
						onFocus={(e) => {analytics.trackClickInputPrKey()}}
						required
						autoComplete="off"
						spellCheck="false"
						/>
				<button onClick={(e) => importPromocode()}>{props.translate("import.apply") || "Apply"}</button>
			</div>
			{/* <div className="importer pkey">
        <div className="importer__symbol">
          <img src={require('../../../assets/img/landing/privatekey_active.svg')} />
          <div className="importer__name">{props.translate("import.from_promo_code") || "PROMO CODE"}</div>
        </div>
				<button className="importer__button" onClick={(e) => props.modalOpen()}>{props.translate("import.from_promo_code_input_title_placehoder") || "Enter your Promo code"}</button>
	
			</div>

			<Modal
				className={{ base: 'reveal medium', afterOpen: 'reveal medium import-privatekey' }}
				isOpen={props.isOpen}
				onRequestClose={() => props.onRequestClose()}
				content={
					<div>
						<div className="title">{ props.translate("import.from_promo_code_input_title") || "ENTER YOUR PROMO CODE"}</div><a className="x" onClick={props.onRequestClose}>&times;</a>
						<div className="content with-overlap">
							<div className="row">
								<div className="column">
									<center>
										<label className={!!props.pKeyError ? "error" : ""}>
											<div className="input-reveal">
												<input className="text-center security" id="promo_code"
												type="text"
												onChange={(e) => props.onChange(e)}
												onKeyPress={(e) => submit(e)}
												value={props.privateKey}
												autoFocus
												autoComplete="off"
												spellCheck="false"
												onFocus={(e) => {analytics.trackClickInputPrKey()}}
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
							<button className="button accent cur-pointer" id="submit_pkey" onClick={() => handldeSubmit()} >{props.translate("modal.import") || "Access"}</button>
						</div>

					</div>
				}
			/> */}
		</div>
	)
}

export default ImportByPromoCodeView
