import React from "react"
import { multiplyOfTwoNumber, roundingNumber } from "../../utils/converter";
import BLOCKCHAIN_INFO from "../../../../env";

const PortfolioOverview = (props) => {
  return (
    <div className="common__slide-up">
      <div className={"portfolio__account-top"}>
        <div className={"portfolio__account-top-item"}>
          <div className={"common__mb-10"}>
            <span className={"portfolio__account-txt"}>{props.translate('transaction.balance') || 'Balance'}</span>
            <span className={"portfolio__account-txt-small"}>{props.translate('portfolio.supported_tokens') || 'Supported tokens'}</span>
          </div>
          <div className={"portfolio__account-txt-big"}>
            {props.currency === 'ETH' ? roundingNumber(props.totalBalanceInETH) : roundingNumber(multiplyOfTwoNumber(props.totalBalanceInETH, props.rateETHInUSD))} {props.currency}
          </div>
        </div>
        <div className={"portfolio__account-top-item"}>
          <div className={"common__mb-10"}>
            {/*<span className={"portfolio__account-txt"}>24h% change</span>*/}
            <span className={"portfolio__account-tag theme__tag"} onClick={() => props.switchCurrency(props.currency)}>
              {props.currency === 'ETH' ? 'USD' : 'ETH'}
            </span>
          </div>
          <div>
            {/*<span className={"portfolio__account-txt-big"}>0 {props.currency}</span>*/}
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
        <span className={"portfolio__account-reimport"} onClick={props.reImportWallet}>
          {props.translate("change") || "Change"}
        </span>
      </div>
    </div>
  )
};

export default PortfolioOverview
