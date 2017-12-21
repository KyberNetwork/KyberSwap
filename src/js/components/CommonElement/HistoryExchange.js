import React from "react"
import { toT } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"

const HistoryExchange = (props) => {

  function hashDetailLink(hash) {
    const url = BLOCKCHAIN_INFO.ethScanUrl + 'tx/'
    return url + hash
  }

  function getTokenSymbol(address) {
    for (let key in props.tokens) {
      if (address === props.tokens[key].address) {
        return { key, decimal: props.tokens[key].decimal }
      }
    }
  }



  function createRecap(log) {
    const sourceToken = getTokenSymbol(log.source)
    const destToken = getTokenSymbol(log.dest)
    const sender = log.sender.slice(0, 8) + " ... " + log.sender.slice(-6)
    const sourceAmount = toT(log.actualSrcAmount, sourceToken.decimal).slice(0, 7)
    const destAmount = toT(log.actualDestAmount, destToken.decimal).slice(0, 7)
    return (
      <div>
        <strong>{sourceAmount + ' ' + sourceToken.key}</strong> to 
        <strong> {destAmount + ' ' + destToken.key}</strong>
      </div>
    )
  }

  function getIcon(tokenAddress){
    let token = getTokenSymbol(tokenAddress)
    return props.tokens[token.key].icon
  }

  function calculateTimeStamp(currentBlock, lastBlock, averageTime) {
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

  var content = props.logs.map(function (item, i) {
    return (
      <div key={i} class="small-12 medium-6 large-4 column">
        <div class="history-stamp">
          <img class="token-from" src={require('../../../assets/img/tokens/' + getIcon(item.source))} />
          <img class="token-to" src={require('../../../assets/img/tokens/' + getIcon(item.dest))} />
          <div class="amount">{createRecap(item)}</div>
          <a class="link" href={hashDetailLink(item.txHash)} target="_blank">
            {item.txHash.slice(0, 10)} ... {item.txHash.slice(-6)}
          </a>
          <div class="timestamp">
            {calculateTimeStamp(item.blockNumber, props.lastBlock, props.averageTime)}
          </div>
        </div>
      </div>
    )
  })
  return (
    <div id="history-exchange" className={props.isFetching ? "row loading" : "row"}>
      <div class="history-content">
        <div class="column small-11 large-12 small-centered">
          <div class="row">
            {content}
          </div>
        </div>
      </div>
      <div class="history-pargination">
        <div>
          <a onClick={(e) => props.first(e)} className={props.currentPage === 0 ? "first disabled" : "first"}>Newest history</a>
        </div>
        <div>
          <a onClick={(e) => props.previous(e)} className={props.currentPage === 0 ? "previous disabled" : "previous"}>Previous history</a>
          <a onClick={(e) => props.next(e)} className={props.currentPage >= (Math.round(props.eventsCount / props.itemPerPage) - 1) ? "next disabled" : "next"}>More history</a>
        </div>
      </div>
    </div>

  )
}

export default HistoryExchange;