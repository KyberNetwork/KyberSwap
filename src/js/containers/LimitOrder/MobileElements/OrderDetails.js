import React, { Fragment } from "react"
import { getFormattedDate } from "../../../utils/common";
import { displayNumberWithDot, divOfTwoNumber, formatNumber, multiplyOfTwoNumber, roundingRateNumber } from "../../../utils/converter";
import  { LIMIT_ORDER_CONFIG } from "../../../services/constants";
import BLOCKCHAIN_INFO from "../../../../../env";

const OrderDetails = (props) => {
  let { source, dest, min_rate, src_amount, fee, side_trade, updated_at, tx_hash, receive, status, user_address } = props.order;
  source = source ? source : '--';
  dest = dest ? dest : '--';
  const formattedFee = formatNumber(multiplyOfTwoNumber(fee, src_amount), 5, '');
  const sourceAmount = formatNumber(src_amount, 6);
  const destAmount = formatNumber(multiplyOfTwoNumber(src_amount, min_rate), 6);
  const datetime = updated_at ? getFormattedDate(updated_at) : false;
  const isFilledOrder = status === LIMIT_ORDER_CONFIG.status.FILLED;
  const isBuyTrade = side_trade === "buy";
  const baseSymbol = isBuyTrade ? dest : source;
  const quoteSymbol = isBuyTrade ? source : dest;
  const rate = isBuyTrade ? roundingRateNumber(divOfTwoNumber(1, min_rate)) : displayNumberWithDot(min_rate, 9);

  return (
    <div className={`order-item__container ${props.isModal ? 'limit-order-list--table-mobile' : ''}`}>
      <div className="order-item">
        {(datetime && !props.isModal) && (
          <div className={"order-item__date theme__background-3"}>{datetime}</div>
        )}

        {props.isModal && <div/>}

        <div className={"order-item__row"}>
          <div className={"order-item__column order-item__pair theme__text"}>
            <span className={"common__capitalize"}>{side_trade}</span> {baseSymbol}
          </div>
          <div className={"order-item__column"}/>
          <div className={"order-item__column"}>
            {(status === LIMIT_ORDER_CONFIG.status.OPEN && !props.isModal) && (
              <div className={"order-item__cancel"} onClick={() => props.openCancelOrderModal(props.order)}>×</div>
            )}

            {status === LIMIT_ORDER_CONFIG.status.FILLED && (
              <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${tx_hash}`} target="_blank" rel="noopener noreferrer" className={"order-item__view-tx"}/>
            )}
          </div>
        </div>
        <div className={"order-item__row"}>
          <div className={"order-item__column theme__text-3"}>
            {`${user_address.slice(0, 6)} ... ${user_address.slice(-4)}`}
          </div>
          <div className={"order-item__column"}>
            <span className={"theme__text-3 order-item__title common__mr-5"}>{props.translate('price') || 'Price'}</span>
            <span className={"theme__text order-item__value"}>{rate}</span>
          </div>
          <div className={"order-item__column"}>
            <div className="cell-status__container">
              <div className={`cell-status cell-status__mobile cell-status--${status}`}>{status.toUpperCase()}</div>
            </div>
          </div>
        </div>
        <div className={"order-item__row"}>
          <div className={"order-item__column"}>
            {(isFilledOrder && isBuyTrade) &&
              <Fragment>
                <div className={"theme__text-3 order-item__title"}>{props.translate('limit_order.total') || 'Total'}</div>
                <div className={"theme__text order-item__value"}>{isBuyTrade ? sourceAmount : destAmount} {quoteSymbol}</div>
              </Fragment>
            }

            {(!isFilledOrder || !isBuyTrade) &&
              <Fragment>
                <div className={"theme__text-3 order-item__title"}>{props.translate('limit_order.amount') || 'Amount'}</div>
                <div className={"theme__text order-item__value"}>{isBuyTrade ? destAmount : sourceAmount} {baseSymbol}</div>
              </Fragment>
            }
          </div>

          <div className={"order-item__column"}>
            {isFilledOrder &&
              <Fragment>
                <div className={"theme__text-3 order-item__title"}>{props.translate('received') || 'Received'}</div>
                <div className={"theme__text order-item__value"}>{receive} {dest.toUpperCase()}</div>
              </Fragment>
            }

            {!isFilledOrder &&
              <Fragment>
                <div className={"theme__text-3 order-item__title"}>{props.translate('limit_order.total') || 'Total'}</div>
                <div className={"theme__text order-item__value"}>{isBuyTrade ? sourceAmount : destAmount} {quoteSymbol}</div>
              </Fragment>
            }
          </div>
          <div className={"order-item__column"}>
            <div className={"theme__text-3 order-item__title"}>{props.translate('limit_order.fee') || 'Fee'}</div>
            <div className={"theme__text order-item__value"}>{formattedFee} {source}</div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default OrderDetails
