import React from "react";
import { Modal } from "../../components/CommonElement"
import ConfirmTransferModal from "./ConfirmTransferModal";

const AnalyzelogModal = (props) => {
    let listErrors = ""
    let loading = (
        <div class="text-center">
            <img src={require("../../../assets/img/spinner.svg")} width="90"/>
        </div>
    )
    if (props.analyze.isAnalizeComplete) {
        var isEmpty = true
        listErrors = Object.keys(props.analyze.analizeError).map(key => {
            if(Object.keys(props.analyze.analizeError[key]).length > 0) isEmpty = false
            var list = Object.keys(props.analyze.analizeError[key]).map(keyItem => {
                return (<div key={key + keyItem} className="reason-item">{props.analyze.analizeError[key][keyItem]}</div>)
            })
            return list
        })
        listErrors = isEmpty ? (
            <div className="reason-item">{props.translate('transaction.no_reason_found') || 'No any reason was found'}</div>
        ) : listErrors
    }

    const content = (
        <div>
            <div class="title text-center">{props.title ? props.title : props.translate("transaction.analyze_error") || "Failed reasons"}</div><a class="x" onClick={props.onRequestClose}>&times;</a>
            <div class="content">
                <div class="row">
                    <div class="column">
                        <div class="reason-analyze">{listErrors || loading}</div>
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <Modal
            className={{
                base: 'reveal tiny',
                afterOpen: 'reveal tiny'
            }}
            isOpen={props.isOpen}
            contentLabel="Analysis summary"
            content={content}
            onRequestClose={props.onRequestClose}
        />
    )

}

export default AnalyzelogModal