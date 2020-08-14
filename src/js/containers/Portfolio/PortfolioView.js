import React, { Fragment } from "react"
import ImportAccount from "../ImportAccount/ImportAccount";
import { AccountBalance } from "../TransactionCommon";
import PortfolioTxHistory from "./PortfolioTxHistory";
import PortfolioEquity from "./PortfolioEquity";
import PortfolioTab from "./PortfolioTab";
import PortfolioOverview from "./PortfolioOverview";
import { PORTFOLIO_TAB } from "../../services/constants";
import PortfolioPerformance from "./PortfolioPerformance";

const PortfolioView = (props) => {
  const isOverViewDisplayed = props.isOnMobile ? props.isImported && props.mobileTab === PORTFOLIO_TAB.overview : props.isImported;
  const isBalanceDisplayed = props.isOnMobile ? props.isImported && props.mobileTab === PORTFOLIO_TAB.balance : props.isImported;
  const isHistoryDisplayed = props.isOnMobile ? props.isImported && props.mobileTab === PORTFOLIO_TAB.history : props.isImported;
  const isEquityDisplayed = props.account.availableTokens && props.account.availableTokens.length > 0;

  return (
    <div className={`portfolio theme__text ${props.isImported ? '' : 'portfolio--not-imported'}`}>
      {props.isOnMobile && (
        <PortfolioTab
          isImported={props.isImported}
          mobileTab={props.mobileTab}
          switchMobileTab={props.switchMobileTab}
        />
      )}

      <div className={`portfolio__left ${props.isOnMobile ? 'theme__background-2' : ''}`}>
        {(isOverViewDisplayed || !props.isImported) && (
          <div className={"portfolio__summary"}>
            <div className={"portfolio__account portfolio__item theme__background-2"}>
              {!props.isImported && (
                <ImportAccount tradeType="portfolio" isAgreedTermOfService />
              )}

              {isOverViewDisplayed && (
                <PortfolioOverview
                  currency={props.currency}
                  totalBalanceInETH={props.account.totalBalanceInETH || 0}
                  rateETHInUSD={props.eth.rateUSD}
                  switchCurrency={props.switchCurrency}
                  address={props.address}
                  reImportWallet={props.reImportWallet}
                  translate={props.translate}
                  walletName={props.account.wallet.getWalletName()}
                  isOnDapp={props.account.isOnDAPP}
                />
              )}
            </div>

            {isOverViewDisplayed && (
              <div className={`portfolio__equity portfolio__item common__slide-up theme__background-${props.isOnMobile ? '11' : '2'}`}>
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

        {isOverViewDisplayed && <div className="portfolio__feedback">
          <i class="portfolio__feedback-icon"></i>
          <p>{props.translate("info.please_give_feedback", { link: "https://docs.google.com/forms/d/e/1FAIpQLSfLUO3O4j6v3CKMtW5yD9auuHbnJY75IM9PLJO9hg1SBRiGaQ/viewform" })}</p>
        </div>}

        {isOverViewDisplayed && <PortfolioPerformance  performanceChart={props.performanceChart} currency={props.currency} isOnMobile={props.isOnMobile}/>}
        
        {isHistoryDisplayed && (
            <PortfolioTxHistory
              historyTxs={props.historyTxs}
            />
        )}
      </div>

      {isBalanceDisplayed && (
        <div className={"portfolio__item__no__padding portfolio__right theme__background-2 no-padding-aside"}>
          <AccountBalance
            screen="portfolio"
            hideZeroBalance={true}
            show24hChange={false}
            selectToken={props.selectToken}
            selectBalanceButton={props.selectBalanceButton}
          />
        </div>
      )}
    </div>
  )
};

export default PortfolioView
