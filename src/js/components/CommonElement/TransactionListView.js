import React from "react"
import { toT, roundingNumber } from "../../utils/converter"
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
      var sourceAmount = toT(item.actualSrcAmount, sourceToken.decimal, 3)
      var sourceAmountFull = toT(item.actualSrcAmount, sourceToken.decimal, 7)
      var desAmount = toT(item.actualDestAmount, destToken.decimal, 3)
      var desAmountFull = toT(item.actualDestAmount, destToken.decimal, 7)
      var rate = roundingNumber(sourceAmountFull / desAmountFull)
      return (
        <div className="clearfix" key={item.txHash} onClick={(e) => gotoLink(item.txHash)}>
          <div className="column small-4 large-2">{calculateTimeStamp(item.timestamp)}</div>
          <div className="column small-3 show-for-large">
            Exchange
            <span className="ml-3">{sourceToken.key} <i className="k k-angle right"></i> {destToken.key}</span>
          </div>
          <div className="column small-3 show-for-large">1 {sourceToken.key} = {rate} {destToken.key}</div>
          <div className="column small-8 large-4">
            <div className="d-flex align-center">
              <span className="mr-auto">
                {sourceAmount} {sourceToken.key} for {desAmount} {destToken.key}
              </span>
              <i className="k k-angle right"></i>
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
          <div className="small-12 column">
            <div className="transaction-list">
              <div className="clearfix header">
                <div className="column small-4 large-2">Date</div>
                <div className="column small-3 show-for-large">Description</div>
                <div className="column small-3 show-for-large">Rate</div>
                <div className="column small-8 large-4">Amount</div>
              </div>
              <CSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}
                class="body"
                component="div">
                {content(props.logsEth)}
              </CSSTransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionListView;