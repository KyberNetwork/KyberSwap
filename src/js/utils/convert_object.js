import { divOfTwoNumber } from "./converter";
import { LIMIT_ORDER_CONFIG } from "../services/constants";

export default function createOrderObject(rawOrder, userAddress) {
  let order = {};

  order.side_trade = rawOrder.sideTrade;
  order.source = rawOrder.sourceTokenSymbol;
  order.dest = rawOrder.destTokenSymbol;
  order.min_rate = rawOrder.triggerRate;
  order.src_amount = rawOrder.sourceAmount;
  order.fee = divOfTwoNumber(rawOrder.orderFeeAfterDiscount, 100);
  order.user_address = userAddress;
  order.status = LIMIT_ORDER_CONFIG.status.NEW;

  return order;
}
