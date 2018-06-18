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

                 <div className="more-info">
                {props.metamask.error !== "" && (
                    <div className="error">{props.metamask.error}</div>
                )}
                {props.metamask.error === "" && (
                    <div className="info">
                        <div className="address">
                            <div>Address</div>
                            <div>{props.metamask.address.slice(0, 8)}...{props.metamask.address.slice(-6)}</div>
                        </div>
                        <div className="address">
                            <div>Balance</div>
                            <div>{props.metamask.balance}</div>
                        </div>
                    </div>
                )}
                </div>              
               
            </div>
            <ReactTooltip place="top" id="metamask-tip" type="dark" />
        </div>
    )
}

export default ImportByMetamaskView