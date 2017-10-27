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
    function componentWillUpdate(nextProps) {
        if (!nextProps.isOpen && props.isOpen) {
            var app = document.getElementById("app")
            app.style.height = "auto"
            app.style.overflow = "initial"
        }
    }
  
    function afterOpenModal(event){
      //get height of window    
      var screenHeight = window.innerHeight
      //get height of modal
      var modalContentInstance = document.getElementsByClassName("react-modal")[0]
      var modalInstance = modalContentInstance.parentNode
      var modalHeight = modalContentInstance.clientHeight;    
  
      if(modalHeight > screenHeight) {
        modalInstance.style.position = 'absolute'
        modalInstance.style.height = (modalHeight + 100) + "px"
  
        app.style.height = (modalHeight + 100) + "px"
        app.style.overflow = "hidden"
      }
    }
    return (
        <Modal
            className={{
                base: props.className.base + " react-modal",
                afterOpen: props.className.afterOpen + ' modal-open',
            }}
            style={customStyles}
            isOpen={props.isOpen}
            onAfterOpen={afterOpenModal.bind(this)}
            onRequestClose={props.onRequestClose}
            contentLabel={props.contentLabel}
        >
            {props.content}
        </Modal>

    )
}

export default MyModal