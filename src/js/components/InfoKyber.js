import React from "react"

import constants from "../services/constants"
import BLOCKCHAIN_INFO from "../../../env"

export default class InfoKyber extends React.Component {
  render() {
    return (
      <div id="info">
        <div class="frame">
          <div class="row">
            <div class="column small-11 medium-9 large-8 small-centered">
              <h1 class="title">Kyber Testnet</h1>
              <p class="info">Version: 0.0.1<br />Chain: Kovan
              <label>Node endpoint
                <input class="address" type="text" value={BLOCKCHAIN_INFO.endpoint} readOnly="true" />
                </label>
                <label>Reserve contract address
                <input class="address" type="text" value={BLOCKCHAIN_INFO.reserve} readOnly="true" />
                </label>
                <label>Network contract address
                <input class="address" type="text" value={BLOCKCHAIN_INFO.network} readOnly="true" />
                </label>Kyber homepage:&nbsp;
              <a href="https://kyber.network" target="_blank">https://kyber.network</a>
                <br></br>Get free Kovan Ether:&nbsp;<a href="#" target="_blank">here</a><br></br>Do not send ethers nor tokens to any of the addresses above.<br></br>They are for test only and we are not likely to have control of them in mainnet.
            </p>
            </div>
          </div>
        </div>
        <img src="/assets/img/bg-wave.png" class="absolute" />
      </div>
    )
  }
}
