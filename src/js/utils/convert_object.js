export default function createOrderObject(rawOrder, userAddress, formType, triggerRate, sourceAmount, fee) {
  let order = {};

  order.side_trade = formType;
  order.source = rawOrder.sourceTokenSymbol;
  order.dest = rawOrder.destTokenSymbol;
  order.min_rate = triggerRate;
  order.src_amount = sourceAmount;
  order.fee = fee;
  order.user_address = userAddress;
  order.status = '';

  return order;
}
