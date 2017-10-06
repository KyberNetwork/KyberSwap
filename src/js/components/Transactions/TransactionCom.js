import React from "react"

const TransactionCom = (props) => {
  function stopParentClick(event) {
    event.stopPropagation();
  }
  return (
	<tr class="item" onClick={props.click}>
	  <td class="hash">
	     <a target="_blank" href={"https://kovan.etherscan.io/tx/" + props.tx.hash} onClick={stopParentClick.bind(this)}>
	        {props.tx.hash}
	      </a>
	  </td>
	  <td class="from"><span>{props.tx.from}</span></td>
	  <td></td>
	  <td>{props.tx.nonce}</td>
	  <td>{props.tx.type}</td>
	  <td><span class={props.tx.status == "mined" || props.tx.status == "success" ? "success" : "fail"}>{props.tx.status}</span></td>
	</tr>
  )
}

export default TransactionCom
