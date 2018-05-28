import React from "react"

const ImportByMetamaskView = (props) => {
    return (
        <div className="column column-block">
            <div className="importer metamask">
                <a onClick={(e) => props.connect(e)}>
                    <img src={require('../../../assets/img/metamask.svg')} />
                </a>
            </div>
            <div className="description">{props.translate("import.from_metamask") || <span>Metamask</span>}</div>            
        </div>
    )
}

export default ImportByMetamaskView