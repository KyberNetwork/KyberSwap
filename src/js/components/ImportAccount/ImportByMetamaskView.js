import React from "react"

const ImportByMetamaskView = (props) => {
    return (
        <div className="column column-block">
            <div className="importer metamask">
                <a onClick={(e) => props.connect(e)}>
                    <img src={require('../../../assets/img/metamask.svg')} />
                    <div className="description">{props.translate("import.from_metamask") || <span>Connect to <br />metamask</span>}</div>
                </a>
            </div>
        </div>
    )
}

export default ImportByMetamaskView