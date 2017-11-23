import React from "react"
import { Modal } from '../CommonElement'

const ImportByPKeyView = (props) => {

	function handldeSubmit(e) {
		e.preventDefault()
		props.importPrivateKey()
	}

	function toggleShowPw(){
		let input = document.getElementById('private_key')
		if(input.type == 'password'){
			input.type = 'text'
			input.parentElement.classList.add('unlock')
		}else if(input.type == 'text'){
			input.type = 'password'
			input.parentElement.classList.remove('unlock')
		}
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
						<div class="content with-overlap">
							<div class="row">
								<div class="column">
									<center style={{marginBottom: 25}} className={!!props.pKeyError ? "error" : ""}>
										<div className={'input-reveal'}>
											<input class="text-center" id="private_key"
												type="password"
												onChange={(e) => props.onChange(e)}
												placeholder="Enter your private key" required />
											<a class="toggle" onClick={() => toggleShowPw()}></a>
										</div>
										{!!props.pKeyError &&
											<span className="error-text">{props.pKeyError}</span>
										}
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