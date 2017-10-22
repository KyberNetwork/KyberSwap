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

const MyModal = (props) => {

    return (
        <Modal
            style={customStyles}
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            contentLabel={props.contentLabel}
        >
            {props.content}
        </Modal>

    )
}

export default MyModal