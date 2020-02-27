import React from "react"
import constansts from "../../services/constants";
import history from "../../history";

const LimitOrderNotification = (props) => {
  const goToSwap = () => {
    history.push(`${constansts.BASE_HOST}/swap/eth-knc`)
    if (window.kyberBus) { window.kyberBus.broadcast('go.to.swap-path') }
  };
  
  return (
    <div className="limit-order-notification theme__background-12">
      <div className="limit-order-notification__text">
        {props.translate('limit_order.free_fee') || 'No fee for Limit Order (10 LOs per day) If you hold 2000 KNC in your wallet'}
      </div>
      <div className="limit-order-notification__button" onClick={goToSwap}>
        {props.translate('limit_order.hold_knc') || 'Hold 2000 KNC now'}
      </div>
    </div>
  )
};

export default LimitOrderNotification;
