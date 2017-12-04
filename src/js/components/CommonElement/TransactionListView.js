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



  // function createRecap(log) {
  //   const sourceToken = getTokenSymbol(log.source)
  //   const destToken = getTokenSymbol(log.dest)
  //   const sender = log.sender.slice(0, 8) + " ... " + log.sender.slice(-6)
  //   const sourceAmount = toT(log.actualSrcAmount, sourceToken.decimal).slice(0, 7)
  //   const destAmount = toT(log.actualDestAmount, destToken.decimal).slice(0, 7)
  //   return (
  //     <div>
  //       <strong>{sourceAmount + ' ' + sourceToken.key}</strong> to
  //       <strong> {destAmount + ' ' + destToken.key}</strong>
  //     </div>
  //   )
  // }

  function getIcon(tokenAddress) {
    let token = getTokenSymbol(tokenAddress)
    return props.tokens[token.key].icon
  }

  function calculateTimeStamp(currentBlock) {
    var lastBlock = props.lastBlock
    var averageTime = props.averageTime
    var seconds = (lastBlock - currentBlock) * averageTime / 1000
    var interval = Math.floor(seconds / 31536000);
    if (interval > 0) {
      return interval + " years ago"
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 0) {
      return interval + " months ago"
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 0) {
      return interval + " days ago"
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 0) {
      return interval + " hours ago"
    }
    interval = Math.floor(seconds / 60);
    if (interval > 0) {
      return interval + " minutes ago"
    }
    return Math.floor(seconds) + " seconds ago"
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
        <div className={"transaction-list-item open"} key={item.txHash} data-pos={i} onClick={(e) => gotoLink(item.txHash)}>
          <div className="inner">
            <div className="coin-icon">
              <div className="coin coin1" key={'coin-1'} style={{ backgroundImage: 'url(\'' + sourceIcon + '\')' }}></div>
              <div className="coin coin2" key={'coin-2'} style={{ backgroundImage: 'url(\'' + destIcon + '\')' }}></div>
            </div>
            <div className="titles">
              <span className="rate" title={sourceAmountFull}>{sourceAmount}</span>
              <span className="coins">{sourceToken.key.toUpperCase()} to {destToken.key.toUpperCase()}</span>
              <span className="time">{calculateTimeStamp(item.blockNumber)}</span>
            </div>
          </div>
        </div>
      )
    })
    return content
  }

  return (
    <div className="frame history">
      <div className="row">
        <div class="column small-11 large-12 small-centered">
          <h1 className="title">TRANSACTION HISTORY</h1>
          <div className="row">
            <div className="small-12 medium-6 large-6 column">
              <span>ETH / TOKEN</span>
              <div className="transaction-list">
                <CSSTransitionGroup
                  transitionName="example"
                  transitionEnterTimeout={1000}
                  transitionLeaveTimeout={1000}>
                  {content(props.logsEth)}
                </CSSTransitionGroup>
              </div>
            </div>
            <div className="small-12 medium-6 large-6 column">
              <span>TOKEN / ETH</span>
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
    </div>
  )
}

export default TransactionListView;