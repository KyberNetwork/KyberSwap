
let limitOrderService
if (process.env && process.env.integrate) {
  limitOrderService = require("./limit_order");
} else {
  limitOrderService = require("./limit_order_mock");
}

export default limitOrderService;
