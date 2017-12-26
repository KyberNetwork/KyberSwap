import React from "react"
import { connect } from "react-redux"

import constants from "../services/constants"
import BLOCKCHAIN_INFO from "../../../env"
import { getTranslate } from 'react-localize-redux';

@connect((store) => {
  return {
    translate: getTranslate(store.locale)
  }
})


export default class InfoKyber extends React.Component {
  render() {
    return (
      <div id="info">
        <div class="frame">
          <div class="row">
            <div class="column small-11 medium-11 large-11 small-centered">
              <p class="info">{this.props.translate("info.version") || "Version"}: 0.0.1<br />{this.props.translate("info.chain") || "Chain"}: Kovan
              <label>{this.props.translate("info.node_endpoint") || "Node endpoint"}
                <input class="address" type="text" value={BLOCKCHAIN_INFO.endpoint} readOnly="true" />
                </label>
                <label>{this.props.translate("info.reserve_address") || "Reserve contract address"}
                <input class="address" type="text" value={BLOCKCHAIN_INFO.reserve} readOnly="true" />
                </label>
                <label>{this.props.translate("info.network_address") || "Network contract address"}
                <input class="address" type="text" value={BLOCKCHAIN_INFO.network} readOnly="true" />
                </label>{this.props.translate("info.kyber_homepage") || "Kyber homepage"}:&nbsp;
              <a href="https://kyber.network" target="_blank">https://kyber.network</a>
                <br></br>{this.props.translate("info.get_free_kovan") || "Get free Kovan Ether"}:&nbsp;<a href="#" target="_blank">{this.props.translate("info.here") || "here"}</a><br></br>{this.props.translate("info.warning") || <span>Do not send ethers nor tokens to any of the addresses above.<br></br>They are for test only and we are not likely to have control of them in mainnet.</span>}
            </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
