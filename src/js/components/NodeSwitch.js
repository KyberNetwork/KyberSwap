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
          <div class="k-select">
            <div class="k-select-display">Infura Kovan</div>
            <div class="k-select-option">
              <div class="selected">Infura Kovan</div>
              <div>Etherscan</div>
              <div>KyberNetwork</div>
              <div>Local</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
