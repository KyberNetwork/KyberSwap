import React from "react"

const ImportByMetamaskView = (props) => {
    return (
        <div className="column column-block">
            <div className="importer metamask">
                <a onClick={(e) => props.connect(e)}>
                    <img src="/assets/img/metamask.svg" />
                    <div className="description">Connect to <br />metamask</div>
                </a>
            </div>
        </div>
    )
}

export default ImportByMetamaskView