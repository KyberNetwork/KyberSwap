import React from "react"
import { toT } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
import { CSSTransitionGroup } from 'react-transition-group'

const TransactionListView = (props) => {

  function hashDetailLink(hash) {
    const url = BLOCKCHAIN_INFO.ethScanUrl + 'tx/'
    return url + hash
  }

  function gotoLink(hash) {
    const url = BLOCKCHAIN_INFO.ethScanUrl + 'tx/' + hash
    window.open(url)
  }

  function getTokenSymbol(address) {
    for (let key in props.tokens) {
      if (address === props.tokens[key].address) {
        return { key, decimal: props.tokens[key].decimal }
      }
    }
  }

  function getIcon(tokenAddress) {
    let token = getTokenSymbol(tokenAddress)
    return props.tokens[token.key].icon
  }

  function calculateTimeStamp(timeStamp) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = Date.now() - timeStamp * 1000;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' ' + (props.translate('history.second_ago') || 'seconds ago');
    }

    else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' ' + (props.translate('history.minutes_ago') || 'minutes ago');
    }

    else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' ' + (props.translate('history.hours_ago') || 'hours ago');
    }

    else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + ' ' + (props.translate('history.days_ago') || 'days ago');
    }

    else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + ' ' + (props.translate('history.months_ago') || 'months ago');
    }

    else {
      return Math.round(elapsed / msPerYear) + ' ' + (props.translate('history.years_ago') || 'years ago');
    }
  }

  function content(list) {
    var content = list.map(function (item, i) {
      var sourceToken = getTokenSymbol(item.source)
      var destToken = getTokenSymbol(item.dest)
      var sourceIcon = getIcon(item.source)
      var destIcon = getIcon(item.dest)
      var sourceAmount = toT(item.actualSrcAmount, sourceToken.decimal, 3)
      var sourceAmountFull = toT(item.actualSrcAmount, sourceToken.decimal, 7)
      return (
        <div className={"transaction-list-item"} key={item.txHash} data-pos={i} onClick={(e) => gotoLink(item.txHash)}>
          <div className="clearfix px-3 py-4">
            <div className="float-left">
              <span className="font-w-b mr-2 font-s-up-1" title={sourceAmountFull}>{sourceAmount}</span>
              <span className="coins">{sourceToken.key.toUpperCase()} to {destToken.key.toUpperCase()}</span>
            </div>
            <div className="float-right font-s-down-1">
              <span className="time">
                {calculateTimeStamp(item.timestamp)} <i className="k k-angle right ml-3"></i>
              </span>
            </div>
          </div>
        </div>
      )
    })
    return content
  }

  return (
    <div className="history mb-8">
      <div className="row small-11 medium-12 large-12">
        <div className="row column">
          <div className="small-12 medium-12 large-12 column">
            <h1 className="title column">{props.translate("transaction_list.transaction_history") || "Transactions"}</h1>
          </div>
        </div>
        <div className="row column">
          <div className="small-12 medium-12 large-6 column">
            {/* <p className="p-3 bg-light">ETH / TOKEN</p> */}
            <div className="transaction-list">
              <CSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}>
                {content(props.logsEth)}
              </CSSTransitionGroup>
            </div>
          </div>
          <div className="small-12 medium-12 large-6 column">
            {/* <p className="px-2 py-3 bg-light">TOKEN / ETH</p> */}
            <div className="transaction-list">
              <CSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}>
                {content(props.logsToken)}
              </CSSTransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionListView;