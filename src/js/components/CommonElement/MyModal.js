import React from "react"
import Modal from 'react-modal'



const MyModal = (props) => {
    const customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(11, 15, 26, 0.8)',
            zIndex: '1005'
        },
        content : {
            // position: 'absolute',
            top: props.size == "tiny" ? '186px' : '54px',
            right: 'auto',
            left: 'auto',
            margin: '0 auto',
            display: 'block'
        }
    }
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