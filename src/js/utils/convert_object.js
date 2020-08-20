import { divOfTwoNumber } from "./converter";

export default function createOrderObject(rawOrder, userAddress, formType, triggerRate, sourceAmount) {
  let order = {};

  order.side_trade = formType;
  order.source = rawOrder.sourceTokenSymbol;
  order.dest = rawOrder.destTokenSymbol;
  order.min_rate = triggerRate;
  order.src_amount = sourceAmount;
  order.fee = divOfTwoNumber(rawOrder.orderFeeAfterDiscount, 100);
  order.user_address = userAddress;
  order.status = '';

  return order;
}
