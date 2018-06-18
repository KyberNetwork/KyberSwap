import React from "react"

const ImportByMetamaskView = (props) => {
    return (
        <div className="column column-block">
            <div className="importer metamask">
                <div className="how-to-use">                    
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
            {/* <div className="description">{props.translate("import.from_metamask") || <span>Metamask</span>}</div>             */}
        </div>
    )
}

export default ImportByMetamaskView