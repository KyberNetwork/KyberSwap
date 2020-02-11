import React, { Fragment } from "react"
import ImportAccount from "../ImportAccount/ImportAccount";
import { AccountBalance } from "../TransactionCommon";
import PortfolioTxHistory from "./PortfolioTxHistory";
import PortfolioEquity from "./PortfolioEquity";
import PortfolioTab from "./PortfolioTab";
import PortfolioOverview from "./PortfolioOverview";
import { PORTFOLIO_TAB } from "../../services/constants";
// import PortfolioPerformance from "./PortfolioPerformance";

const PortfolioView = (props) => {
  const isOverViewDisplayed = props.isOnMobile ? props.isImported && props.mobileTab === PORTFOLIO_TAB.overview : props.isImported;
  const isBalanceDisplayed = props.isOnMobile ? props.isImported && props.mobileTab === PORTFOLIO_TAB.balance : props.isImported;
  const isHistoryDisplayed = props.isOnMobile ? props.isImported && props.mobileTab === PORTFOLIO_TAB.history : props.isImported;
  const isEquityDisplayed = props.account.availableTokens && props.account.availableTokens.length > 0;

  return (
    <div className={`portfolio theme__text ${props.isImported ? '' : 'portfolio--not-imported'}`}>
      {(props.isImported && props.isOnMobile) && (
        <PortfolioTab
          mobileTab={props.mobileTab}
          switchMobileTab={props.switchMobileTab}
        />
      )}
      
      <div className={`portfolio__left ${props.isOnMobile ? 'theme__background-2' : ''}`}>
        {(isOverViewDisplayed || !props.isImported) && (
          <div className={"portfolio__summary"}>
            <div className={"portfolio__account portfolio__item theme__background-2"}>
              {!props.isImported && (
                <ImportAccount tradeType="portfolio" noTerm={true} />
              )}
      
              {isOverViewDisplayed && (
                <PortfolioOverview
                  currency={props.currency}
                  totalBalanceInETH={props.account.totalBalanceInETH}
                  rateETHInUSD={props.eth.rateUSD}
                  switchCurrency={props.switchCurrency}
                  address={props.address}
                  reImportWallet={props.reImportWallet}
                  translate={props.translate}
                  walletName={props.account.wallet.getMetaName()}
                  isOnDapp={props.account.isOnDAPP}
                />
              )}
            </div>
  
            {isOverViewDisplayed && (
              <div className={"portfolio__equity portfolio__item theme__background-2 common__slide-up"}>
                {isEquityDisplayed && (
                  <PortfolioEquity
                    equityChart={props.equityChart}
                    availableTokens={props.account.availableTokens}
                    totalBalanceInETH={props.account.totalBalanceInETH}
                    theme={props.theme}
                  />
                )}
    
                {!isEquityDisplayed && (
                  <div>-- % --</div>
                )}
              </div>
            )}
          </div>
        )}
  
        {isHistoryDisplayed && (
          <Fragment>
            {/*<PortfolioPerformance  performanceChart={props.performanceChart} />*/}
  
            <PortfolioTxHistory
              historyTxs={props.historyTxs}
            />
          </Fragment>
        )}
      </div>
  
      {isBalanceDisplayed && (
        <div className={"portfolio__item portfolio__right theme__background-2"}>
          <AccountBalance
            screen="portfolio"
            hideZeroBalance={true}
            show24hChange={true}
          />
        </div>
      )}
    </div>
  )
};

export default PortfolioView
