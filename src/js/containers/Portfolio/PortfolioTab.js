import React  from "react"
import { PORTFOLIO_TAB } from "../../services/constants";

const PortfolioTab = (props) => {
  return (
    <div className="portfolio__navigation theme__background-2">
      <div
        className={`portfolio__navigation-item ${props.mobileTab === PORTFOLIO_TAB.overview ? 'portfolio__navigation-item--active' : ''}`}
        onClick={() => props.switchMobileTab(PORTFOLIO_TAB.overview)}
      >
        Overview
      </div>
      <div
        className={`portfolio__navigation-item ${props.mobileTab === PORTFOLIO_TAB.balance ? 'portfolio__navigation-item--active' : ''}`}
        onClick={() => props.switchMobileTab(PORTFOLIO_TAB.balance)}>
        Tokens
      </div>
      <div
        className={`portfolio__navigation-item ${props.mobileTab === PORTFOLIO_TAB.history ? 'portfolio__navigation-item--active' : ''}`}
        onClick={() => props.switchMobileTab(PORTFOLIO_TAB.history)}>
        Histories
      </div>
    </div>
  )
};

export default PortfolioTab
