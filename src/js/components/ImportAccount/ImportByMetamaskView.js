import React from "react"
import ReactTooltip from 'react-tooltip'

const ImportByMetamaskView = (props) => {
    return (
        <div className="column column-block">
            <div className="importer metamask">
                <div className="how-to-use" data-tip="How to use" data-for="metamask-tip">                    
                </div>
                <div>
                    <img src={require('../../../assets/img/landing/metamask_active.svg')} />
                </div>
                <div>
                    METAMASK
                </div>
                <div>
                    <button onClick={(e) => props.connect(e)}>Connect</button>
                </div>                
               
            </div>
            <ReactTooltip place="top" id="metamask-tip" type="dark" />
        </div>
    )
}

export default ImportByMetamaskView