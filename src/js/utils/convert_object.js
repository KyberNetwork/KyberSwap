import { divOfTwoNumber } from "./converter";

export default function createOrderObject(rawOrder, userAddress) {
  let order = {};

  order.side_trade = rawOrder.sideTrade;
  order.source = rawOrder.sourceTokenSymbol;
  order.dest = rawOrder.destTokenSymbol;
  order.min_rate = rawOrder.triggerRate;
  order.src_amount = rawOrder.sourceAmount;
  order.fee = divOfTwoNumber(rawOrder.orderFeeAfterDiscount, 100);
  order.user_address = userAddress;
  order.status = '';

  return order;
}
