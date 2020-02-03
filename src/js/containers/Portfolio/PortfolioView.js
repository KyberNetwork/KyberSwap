import React, { Fragment } from "react"
import ImportAccount from "../ImportAccount/ImportAccount";
import BLOCKCHAIN_INFO from "../../../../env";
import { AccountBalance } from "../TransactionCommon";
import PortfolioTxHistory from "./PortfolioTxHistory";
import { multiplyOfTwoNumber, roundingNumber } from "../../utils/converter";
import PortfolioEquity from "./PortfolioEquity";
import PortfolioPerformance from "./PortfolioPerformance";

const PortfolioView = (props) => {
  return (
    <div className={`portfolio common__slide-up theme__text ${props.isImported ? '' : 'portfolio--not-imported'}`}>
      <div className={"portfolio__left"}>
        <div className={"portfolio__summary"}>
          <div className={"portfolio__account portfolio__item theme__background-2"}>
            {!props.isImported && (
              <ImportAccount tradeType="portfolio" noTerm={true} />
            )}
          
            {props.isImported && (
              <Fragment>
                <div className={"portfolio__account-top"}>
                  <div className={"portfolio__account-top-item"}>
                    <div className={"common__mb-10"}>
                      <span className={"portfolio__account-txt"}>Balance</span>
                      <span className={"portfolio__account-txt-small"}>Supported tokens</span>
                    </div>
                    <div className={"portfolio__account-txt-big"}>
                      {props.currency === 'ETH' ? roundingNumber(props.account.totalBalanceInETH) : roundingNumber(multiplyOfTwoNumber(props.account.totalBalanceInETH, props.eth.rateUSD))} {props.currency}
                    </div>
                  </div>
                  <div className={"portfolio__account-top-item"}>
                    <div className={"common__mb-10"}>
                      <span className={"portfolio__account-txt"}>24h% change</span>
                      <span className={"portfolio__account-tag theme__tag"} onClick={() => props.switchCurrency(props.currency)}>
                        {props.currency === 'ETH' ? 'USD' : 'ETH'}
                      </span>
                    </div>
                    <div>
                      <span className={"portfolio__account-txt-big"}>0 {props.currency}</span>
                      {/*<span className={"portfolio__account-change portfolio__account-change--negative"}>-20.87%</span>*/}
                    </div>
                  </div>
                </div>
                <div className={"portfolio__account-bot"}>
                  <div className={"portfolio__account-wallet"}>
                    <div className={"portfolio__account-type"}>MetaMask:</div>
                    <a className={"portfolio__account-address theme__text-3"} target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + props.address}>
                      {props.address.slice(0, 20)}...{props.address.slice(-4)}
                    </a>
                  </div>
                  <span className={"portfolio__account-reimport"} onClick={props.reImportWallet}>{props.translate("change") || "Change"}</span>
                </div>
              </Fragment>
            )}
          </div>
  
          {props.isImported && (
            <div className={"portfolio__equity portfolio__item theme__background-2"}>
              {(props.account.availableTokens && props.account.availableTokens.length > 0) && (
                <PortfolioEquity
                  equityChart={props.equityChart}
                  availableTokens={props.account.availableTokens}
                  totalBalanceInETH={props.account.totalBalanceInETH}
                />
              )}
            </div>
          )}
        </div>
  
        {props.isImported && (
          <Fragment>
            {/*<PortfolioPerformance  performanceChart={props.performanceChart} />*/}
  
            <PortfolioTxHistory
              address={props.address}
              tokenAddresses={props.tokenAddresses}
              historyTxs={props.historyTxs}
            />
          </Fragment>
        )}
      </div>
  
      {props.isImported && (
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
