import React from "react"
import { Modal } from '../CommonElement'

const SelectAddressModal = (props) => {
  return (
    <Modal
      className={{base: 'reveal tiny import-modal', afterOpen: 'reveal tiny'}}
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      contentLabel="Select Address"
      content={
        <div id="cold-wallet">
          <div class="address-list-path">
            {props.content}
          </div>
        </div>
      }
    />
  )
}

export default SelectAddressModal