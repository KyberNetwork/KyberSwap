import React from "react";
import { PendingOverlay } from "../../components/CommonElement";
import TermAndServices from "../../containers/CommonElements/TermAndServices";

const PostTransferBtn = (props) => {

  return (
    <div className="exchange-button">
      <div>
        {props.isHaveAccount && !props.isChangingWallet &&
        <div>
          <a className={props.activeButtonClass + " exchange-button__button"} onClick={props.submit} data-open="passphrase-modal">
            {props.translate("transaction.transfer_now") || "Transfer Now"}
          </a>
          <TermAndServices tradeType="transfer"/>
        </div>
        }
      </div>

      {props.modalPassphrase}

      <PendingOverlay isEnable={props.isConfirming} />
    </div>
  )
}

export default PostTransferBtn
