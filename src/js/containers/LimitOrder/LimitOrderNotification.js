import React from "react"
import constansts from "../../services/constants";
import { Link } from "react-router-dom";

const LimitOrderNotification = (props) => {
  const swapURL = `${constansts.BASE_HOST}/swap/eth-knc`;
  
  return (
    <div className="limit-order-notification theme__background-12">
      <div className="limit-order-notification__text">
        {props.translate('limit_order.free_fee') || 'Gas free swaps (No fees) if you hold 2000 KNC in your wallet'}
      </div>
      <Link className="limit-order-notification__button" to={swapURL}>
        {props.translate('limit_order.hold_knc') || 'Hold 2000 KNC now'}
      </Link>
    </div>
  )
};

export default LimitOrderNotification;
