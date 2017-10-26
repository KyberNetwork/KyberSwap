import React from "react"
import Modal from 'react-modal'

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(11, 15, 26, 0.8)',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    content : {
        // position: 'absolute',
        top: '186px',
        right: 'auto',
        left: 'auto',
        margin: '0 auto',
        display: 'block'
    }
}

const MyModal = (props) => {

    return (
        <Modal
            className={props.className}
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