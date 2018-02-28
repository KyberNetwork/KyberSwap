import React from "react"
import { connect } from "react-redux"

import constants from "../services/constants"
import BLOCKCHAIN_INFO from "../../../env"
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    closeModal: props.closeModal
  }
})

export default class InfoKyber extends React.Component {
  render() {
    return (

      <div>
        <div class="title">Kyber {BLOCKCHAIN_INFO.chainName}</div>
        <a className="x" onClick={(e) => this.props.closeModal(e)}>&times;</a>
        <div class="content">
          <div id="info">
            <div class="font-s-down-1">
              <span class="mr-2">
                <span class="font-w-b">{this.props.translate("info.version") || "Version"}</span>: 0.4.2
          </span>
              <span>
                <span class="font-w-b">{this.props.translate("info.chain") || "Chain"}</span>: {BLOCKCHAIN_INFO.chainName}
              </span>
            </div>
            <p class="mt-6 mb-1 font-w-b">{this.props.translate("info.node_endpoint") || "Node endpoint"}</p>
            <div class="address">{BLOCKCHAIN_INFO.endpoint}</div>
            <p class="mt-4 mb-1 font-w-b">{this.props.translate("info.reserve_address") || "Reserve contract address"}</p>
            <div class="address">
              <a href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + BLOCKCHAIN_INFO.reserve} target="_blank">{BLOCKCHAIN_INFO.reserve}</a>
            </div>
            <p class="mt-4 mb-1 font-w-b">{this.props.translate("info.network_address") || "Network contract address"}</p>
            <div class="address">
              <a href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + BLOCKCHAIN_INFO.network} target="_blank">{BLOCKCHAIN_INFO.network}</a>
            </div>
            <div class="mt-6">
              <p class="mb-1 font-s-down-1">
                {this.props.translate("info.kyber_homepage") || "Kyber homepage"}:&nbsp;
          <a href="https://kyber.network" target="_blank">https://kyber.network</a>
              </p>
              {BLOCKCHAIN_INFO.chainName !== "Mainnet" && (
                <div>
                  <p class="mb-1 font-s-down-1">
                    {this.props.translate("info.get_free_kovan") || "Get free"} {BLOCKCHAIN_INFO.chainName} Ether:&nbsp;<a href={BLOCKCHAIN_INFO.faucet ? BLOCKCHAIN_INFO.faucet : "#"} target="_blank">{this.props.translate("info.here") || "here"}</a>
                  </p>
                  <p class="font-s-down-1">
                    {this.props.translate("info.warning") || <span>Do not send ethers nor tokens to any of the addresses above.<br /> They are for test only and we are not likely to have control of them in mainnet.</span>}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
