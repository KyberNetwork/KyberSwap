
let portfolitoChartService
if (process.env && process.env.integrate) {
    portfolitoChartService = require("./portfolioChartService");
} else {
    portfolitoChartService = require("./portfolioChartMock");
}

export default portfolitoChartService;
