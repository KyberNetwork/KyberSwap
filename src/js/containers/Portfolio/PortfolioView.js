import React, { Fragment } from "react"
import ImportAccount from "../ImportAccount/ImportAccount";
import BLOCKCHAIN_INFO from "../../../../env";
import { AccountBalance } from "../TransactionCommon";
import PortfolioTxHistory from "./PortfolioTxHistory";

const PortfolioView = (props) => {
  return (
    <div className={"portfolio common__slide-up theme__text"}>
      <div className={"portfolio__left"}>
        <div className={"portfolio__summary"}>
          <div className={"portfolio__account portfolio__item theme__background-2"}>
            {!props.account && (
              <ImportAccount
                tradeType="portfolio"
                noTerm={true}
              />
            )}
          
            {props.account && (
              <Fragment>
                <div className={"portfolio__account-top"}>
                  <div className={"portfolio__account-top-item"}>
                    <div className={"common__mb-10"}>
                      <span className={"portfolio__account-txt"}>Balance</span>
                      <span className={"portfolio__account-txt-small"}>Supported tokens</span>
                    </div>
                    <div className={"portfolio__account-txt-big"}>5,269.13 ETH</div>
                  </div>
                  <div className={"portfolio__account-top-item"}>
                    <div className={"common__mb-10"}>
                      <span className={"portfolio__account-txt"}>24h% change</span>
                      <span className={"portfolio__account-tag theme__tag"}>USD</span>
                    </div>
                    <div>
                      <span className={"portfolio__account-txt-big"}>-0.877654 ETH</span>
                      <span className={"portfolio__account-change portfolio__account-change--negative"}>-20.87%</span>
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
        
          <div className={"portfolio__equity portfolio__item theme__background-2"}>
            <canvas width="250" height="200" ref={props.equityChart}/>
          </div>
        </div>
      
        <div className={"portfolio__performance portfolio__item theme__background-2"}>
          <div className={"portfolio__title"}>Portfolio Performance</div>
          <canvas className={"portfolio__performance-chart"} height="200" ref={props.performanceChart}/>
        </div>
  
        {props.account && (
          <PortfolioTxHistory
            address={props.address}
            tokenAddresses={props.tokenAddresses}
            historyTxs={props.historyTxs}
          />
        )}
      </div>
    
      <div className={"portfolio__item portfolio__right theme__background-2"}>
        <AccountBalance
          screen="portfolio"
          hideZeroBalance={true}
          show24hChange={true}
        />
      </div>
    </div>
  )
};

export default PortfolioView
