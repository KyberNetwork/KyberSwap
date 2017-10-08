import React from "react"

const NodeSwitch = () => {  
  return (
    <div class="node">
      <div>
        <i class="k-icon k-icon-node"></i> Node
      </div>
      <div class="node-select">
        <select class="selectric" disabled >
          <option>Infura Kovan</option>
          <option>Kyber Kovan</option>
          <option>Etherscan</option>
          <option>Local</option>
        </select>
      </div>
    </div>
  )  
}

export default NodeSwitch  