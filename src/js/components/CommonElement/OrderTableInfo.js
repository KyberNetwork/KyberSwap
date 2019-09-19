import React from "react";
import * as converters from "../../utils/converter";

const OrderTableInfo = (props) => {
  var makeOrderInfo = (higherRateOrders) => {
    return higherRateOrders.map((item, index) => {
      let fee = converters.formatNumber(item.fee * item.src_amount, 5, '')
      let source = item.source == "WETH" ? "ETH*" : item.source
      let dest = item.dest == "WETH" ? "ETH*" : item.dest
      switch (item.side_trade) {
        case "buy":
          let quote = source
          let base = dest
          return (
            <div key={index} className={"info"}>
              <div>{item.side_trade}</div>
              <div>{+item.min_rate !== 0 ? converters.roundingNumber(1 / item.min_rate) : 0} {quote}</div>
              <div>{converters.roundingNumber(item.src_amount * item.min_rate)} {base}</div>
              <div>{converters.roundingNumber(item.src_amount)} {quote}</div>
              <div>{fee} {quote}</div>
            </div>
          )
        case "sell":
          quote = dest
          base = source
          return (
            <div key={index} className={"info"}>
              <div>{item.side_trade}</div>
              <div>{converters.roundingNumber(item.min_rate)} {quote}</div>
              <div>{converters.roundingNumber(item.src_amount)} {base}</div>
              <div>{converters.roundingNumber(item.src_amount * item.min_rate)} {quote}</div>
              <div>{fee} {base}</div>
            </div>
          )
        default:
          return (
            <div key={index} className={"info"}>
              <div>{"-"}</div>
              <div>{converters.roundingNumber(item.min_rate)} {dest}</div>
              <div>{converters.roundingNumber(item.src_amount)} {source}</div>
              <div>{converters.roundingNumber(item.min_rate * item.src_amount)} {item.dest}</div>
              <div>{fee} {item.source}</div>
            </div>
          )
      }
    })
  }
    
  return (
    <div className={"order-table-info"}>
      <div className={"order-table-info__header"}>
        <div>{"Type"}</div>
        <div>{"Price"}</div>
        <div>{"Amount"}</div>
        <div>{"Total"}</div>
        <div>{"Fee"}</div>
      </div>
      <div className={"order-table-info__body"}>
        {makeOrderInfo(props.listOrder)}
      </div>
    </div>
  )
};

export default OrderTableInfo;
