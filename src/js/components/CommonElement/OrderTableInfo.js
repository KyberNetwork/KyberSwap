import React from "react";
import * as converters from "../../utils/converter";

const OrderTableInfo = (props) => {
  var makeOrderInfo = (orders) => {
    return orders.map((item, index) => {
      let fee = converters.formatNumber(converters.multiplyOfTwoNumber(item.fee, item.src_amount), 5);
      let source = item.source === "WETH" ? "ETH*" : item.source
      let dest = item.dest === "WETH" ? "ETH*" : item.dest;
      const amount = converters.formatNumber(converters.multiplyOfTwoNumber(item.src_amount, item.min_rate), 6);
      const formattedMinRate = converters.formatNumber(item.min_rate, 6);
      const formattedSrcAmount = converters.formatNumber(item.src_amount, 6);

      switch (item.side_trade) {
        case "buy":
          return (
            <div key={index} className={"info"}>
              <div>{`${source}/${dest}`}</div>
              <div>{+item.min_rate !== 0 ? converters.formatNumber(item.min_rate, 6) : "-"} {dest}</div>
              <div>{converters.formatNumber(converters.divOfTwoNumber(item.src_amount, item.min_rate), 6)} {source}</div>
              <div>{converters.formatNumber(item.src_amount, 6)} {dest}</div>
              <div>{fee} {dest}</div>
            </div>
          );
        case "sell":
          let quote = dest;
          let base = source;

          return (
            <div key={index} className={"info"}>
              <div>{`${base}/${quote}`}</div>
              <div>{formattedMinRate} {quote}</div>
              <div>{formattedSrcAmount} {base}</div>
              <div>{amount} {quote}</div>
              <div>{fee} {base}</div>
            </div>
          );
      }
    })
  };
    
  return (
    <div className={"order-table-info"}>
      <div className={"order-table-info__header theme__background-33 theme__text-6"}>
        <div>{props.translate("limit_order.pair") || "Pair"}</div>
        <div>{props.translate("limit_order.price") || "Price"}</div>
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
