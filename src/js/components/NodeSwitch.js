import React from "react"
import { connect } from "react-redux"


export default class NodeSwitch extends React.Component {
  render() {
    return (
      <div class="node">
        <div>
          <i class="k-icon k-icon-node"></i> Node
        </div>
        <div class="node-select">
          <select class="selectric">
            <option>Infura Kovan</option>
            <option>Kyber Kovan</option>
            <option>Etherscan</option>
            <option>Local</option>
          </select>
        </div>
      </div>
    )
  }
}
