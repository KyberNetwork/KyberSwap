import React from "react"

import constants from "../services/constants"

export default class InfoKyber extends React.Component {
  render() {
    return (
      <div class="info">
        <div class="content">
          <div>
            <label>Version:</label>
            <span>0.0.1</span>
          </div>
          <div>
            <label>Chain:</label>
            <span>Kovan</span>
          </div>
          <div>
            <label>Node endpoint:</label>
            <span>
              https://kovan.infura.io/0BRKxQ0SFvAxGL72cbXi
            </span>
          </div>
          <div>
            <label>Reserve contract address:</label>
            <span>
              <a href="https://kovan.etherscan.io/address/0x60860ce9688f4200e87e61b9a9a171cee1dc5f65">
                0x60860ce9688f4200e87e61b9a9a171cee1dc5f65
              </a>
            </span>
          </div>
          <div>
            <label>Network contract address:</label>
            <span>
              <a href={"https://kovan.etherscan.io/address/" + constants.NETWORK_ADDRESS}>
                {constants.NETWORK_ADDRESS}
              </a>
            </span>
          </div>
          <div>
            <label>Kyber homepage:</label>
            <span>
              <a href="https://kyber.network">https://kyber.network</a>
            </span>
          </div>
        </div>
        <div class="alert">
          Do not send ethers nor tokens to any of the addresses above. They are for test only and we are not likely to have control of them in mainnet.
        </div>
      </div>
    )
  }
}
