import React from "react"

const ImportByTrezorView = (props) => {
  return (
  	<div>
		  <div class="importer trezor">
				<div className="how-to-use">                    
        </div>
				<div>
						<img src={require('../../../assets/img/landing/trezor_active.svg')} />
				</div>
				<div>
						TREZOR
				</div>
				<div>
						<button onClick={(e) => props.showLoading('trezor')}>Connect</button>
				</div> 
		  </div>
  	</div>
  )
}

export default ImportByTrezorView