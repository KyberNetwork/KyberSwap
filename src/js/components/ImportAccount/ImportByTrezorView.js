import React from "react"
import ReactTooltip from 'react-tooltip'

const ImportByTrezorView = (props) => {
  return (
  	<div>
		  <div class="importer trezor">
				<div className="how-to-use" data-for="trezor-tip" data-tip="How to use">                    
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
			<ReactTooltip place="top" id="trezor-tip" type="dark" />
  	</div>
  )
}

export default ImportByTrezorView