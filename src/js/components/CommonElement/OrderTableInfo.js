import React from "react";
import * as converters from "../../utils/converter";

const OrderTableInfo = (props) => {
  var makeOrderInfo = (orders) => {
    return orders.map((item, index) => {
      const fee = converters.formatNumber(converters.multiplyOfTwoNumber(item.fee, item.src_amount), 5);
      const srcSymbol = item.source === "WETH" ? "ETH*" : item.source
      const destSymbol = item.dest === "WETH" ? "ETH*" : item.dest;
      const formattedRate = +item.min_rate !== 0 ? converters.formatNumber(item.min_rate, 6) : "-";
      const total = converters.formatNumber(item.src_amount, 6);
      const buyAmount = converters.formatNumber(converters.divOfTwoNumber(item.src_amount, item.min_rate), 6);
      const sellAmount = converters.formatNumber(converters.multiplyOfTwoNumber(item.src_amount, item.min_rate), 6);
      
      if (item.side_trade === 'buy' && props.cancelModal) {
        return (
          <div key={index} className={"info"}>
            <div>{`${destSymbol} / ${srcSymbol}`}</div>
            <div>{converters.formatNumber(converters.divOfTwoNumber(1, item.min_rate), 6)} {destSymbol}</div>
            <div>{sellAmount} {destSymbol}</div>
            <div>{total} {srcSymbol}</div>
            <div>{fee} {srcSymbol}</div>
          </div>
        );
      } else if (item.side_trade === 'buy') {
        return (
          <div key={index} className={"info"}>
            <div>{`${srcSymbol} / ${destSymbol}`}</div>
            <div>{formattedRate} {destSymbol}</div>
            <div>{buyAmount} {srcSymbol}</div>
            <div>{total} {destSymbol}</div>
            <div>{fee} {destSymbol}</div>
          </div>
        );
      } else if (item.side_trade === 'sell') {
        return (
          <div key={index} className={"info"}>
            <div>{`${srcSymbol} / ${destSymbol}`}</div>
            <div>{formattedRate} {destSymbol}</div>
            <div>{total} {srcSymbol}</div>
            <div>{sellAmount} {destSymbol}</div>
            <div>{fee} {srcSymbol}</div>
          </div>
        );
      }
      
      return '';
    })
  };
    
  return (
    <div className={"order-table-info"}>
      <div className={"order-table-info__header theme__background-33 theme__text-6"}>
        <div>{props.translate("limit_order.pair") || "Pair"}</div>
        <div>{props.translate("price") || "Price"}</div>
        <div>{props.translate("limit_order.amount") || "Amount"}</div>
        <div>{props.translate("limit_order.total") || "Total"}</div>
        <div>{props.translate("limit_order.fee") || "Fee"}</div>
      </div>
      <div className={"order-table-info__body"}>
        {makeOrderInfo(props.listOrder)}
      </div>
    </div>
  )
};

export default OrderTableInfo;
