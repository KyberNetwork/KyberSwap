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
        return {key, decimal: props.tokens[key].decimal}
      }
    }
  }



  function createRecap(log) {
    const sourceToken = getTokenSymbol(log.source)
    const destToken = getTokenSymbol(log.dest)
    const sender = log.sender.slice(0, 8) + " ... " + log.sender.slice(-6)
    const sourceAmount = toT(log.actualSrcAmount, sourceToken.decimal).slice(0, 7)
    const destAmount = toT(log.actualDestAmount, destToken.decimal).slice(0, 7)
    return `${sender} exchange ${sourceAmount} ${sourceToken.key} to 
            ${destAmount} ${destToken.key}`
  }

  function calculateTimeStamp(currentBlock, lastBlock, averageTime) {
    var seconds = (lastBlock - currentBlock)*averageTime / 1000
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
    return <tr key={i}>
      <td>
        <a href={hashDetailLink(item.txHash)} target="_blank">
          {item.txHash.slice(0, 10)} ... {item.txHash.slice(-6)}
        </a>
      </td>
      <td>
        {createRecap(item)}
      </td>
      <td>
        {calculateTimeStamp(item.blockNumber, props.lastBlock, props.averageTime)}
      </td>
    </tr>
  })
  function createCaption(){
    if(props.isFirstPage){
      return `Exchange transactions in ${props.range} blocks from block ${props.toBlock} (the lastest block)`
    }else{
      return `Exchange transactions in ${props.range} blocks from block ${props.toBlock}`
    }
  }
  return (
    <div id="history-exchange" className = {props.isFetching?"row loading":"row"}>
      {/* <div class="history-caption">
        From block {props.fromBlock} to block {props.toBlock}
      </div>       */}
      <div class="history-content">
        <table>
          <caption>
            {createCaption()}
          </caption>
          <thead>
            <tr>
              <th>Tx hash</th>
              <th>Description</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {content}
          </tbody>
        </table>
      </div>
      <div class="history-pargination">
        <div>
          <a onClick={(e)=>props.first(e)} className={props.isFirstPage?"first disabled":"first"}>Newest history</a>
        </div>
        <div>
          <a onClick = {(e)=>props.previous(e)}  className={props.isFirstPage?"previous disabled":"previous"}>Previous history</a>
          <a onClick = {(e)=>props.next(e)} className="next">More history</a>
        </div>        
      </div>      
    </div>

  )
}

export default HistoryExchange;