import React from "react";
import { PendingOverlay } from "../../components/CommonElement";
import TermAndServices from "../../containers/CommonElements/TermAndServices";

const PostExchangeBtn = (props) => {
  return (
    <div className="exchange-button">
      <div>
        {props.isHaveAccount && !props.isChangingWallet &&
          <div>
            <a className={props.activeButtonClass + " exchange-button__button theme__button"} onClick={props.submit} data-open="passphrase-modal">
              {props.translate("transaction.swap_now") || "Swap Now"}
            </a>
            <TermAndServices tradeType="swap"/>
          </div>
        }
      </div>

      {props.modalExchange}

      <PendingOverlay isEnable={props.isConfirming || props.isApproving}/>
    </div>
  )
}

export default PostExchangeBtn
