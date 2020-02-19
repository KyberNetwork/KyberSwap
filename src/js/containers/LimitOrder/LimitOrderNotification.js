import React from "react"

const LimitOrderNotification = (props) => {
  return (
    <div className="limit-order-notification theme__background-12">
      <div className="limit-order-notification__text">
        {props.translate('limit_order.free_fee') || 'Gas free swaps (No fees) if you hold 2000 KNC in your wallet'}
      </div>
      <div className="limit-order-notification__button">
        {props.translate('limit_order.hold_knc') || 'Hold 2000 KNC now'}
      </div>
    </div>
  )
};

export default LimitOrderNotification;
