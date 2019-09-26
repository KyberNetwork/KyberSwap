export default function makeOrderInfo(rawOrder) {
  let listOrder = []
  let order = {}
  order.side_trade = rawOrder.sideTrade
  order.source = rawOrder.sourceTokenSymbol
  order.dest = rawOrder.destTokenSymbol
  order.min_rate = rawOrder.triggerRate
  order.src_amount = rawOrder.sourceAmount
  order.fee = rawOrder.orderFeeAfterDiscount
  listOrder.push(order)
  return listOrder
}
