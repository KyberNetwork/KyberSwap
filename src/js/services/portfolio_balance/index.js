
let portfolitoChartService
if (process.env && process.env.integrate) {
    portfolitoChartService = require("./portfolioChartService");
} else {
    portfolitoChartService = require("./portfolioChartService");
}

export default portfolitoChartService;
