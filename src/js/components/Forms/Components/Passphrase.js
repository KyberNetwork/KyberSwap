import React from "react"
import Modal from 'react-modal'

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(139, 87, 42, 0.55)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}

const Passphrase = (props) => {
  console.log("+++++++++++++++ run to passphrase")
  console.log(props);
  return(
    <Modal  
      style={customStyles}    
        isOpen={props.isOpen}
        onRequestClose={props.closeModal}
          contentLabel ="change gas"
        >
      <div>{props.recap}</div>
      <input type="password" id="passphrase"/>
      <button onClick={props.processTx}>{props.type}</button>
    </Modal>
  )
}

export default Passphrase;