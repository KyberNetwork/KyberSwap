import React from "react"
import { connect } from "react-redux"


export default class NodeSwitch extends React.Component {
  render() {
    return (
      <div class="node-select">
        <div class="k-select">
          <div class="k-select-display">Infura Kovan</div>
          <div class="k-select-option">
            <div class="selected">Kyber network</div>
            <div>Influra</div>
            <div>Etherscan</div>
            <div>Local</div>
          </div>
        </div>
      </div>
    )
  }
}
