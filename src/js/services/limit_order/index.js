

import * as limit_order from "./limit_order"
import * as limit_order_mock from "./limit_order_mock"

const limitOrderService = process.env && process.env.integrate ? limit_order : limit_order_mock;

export default limitOrderService;
