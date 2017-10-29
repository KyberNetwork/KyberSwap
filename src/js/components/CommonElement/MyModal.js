import React from "react"
import Modal from 'react-modal'


// const customStyles = {
//     overlay: {
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(11, 15, 26, 0.8)',
//         zIndex: '1005'
//     },
//     content: {
//         // position: 'absolute',
//         top: props.size == "tiny" ? '186px' : '54px',
//         right: 'auto',
//         left: 'auto',
//         margin: '0 auto',
//         display: 'block'
//     }
// }
//const MyModal = (props) => {
export default class MyModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            customStyles: {
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(11, 15, 26, 0.8)',
                    zIndex: '1005'
                },
                content: {
                    // position: 'absolute',
                    top: props.size == "tiny" ? '186px' : '54px',
                    right: 'auto',
                    left: 'auto',
                    margin: '0 auto',
                    display: 'block'
                }
            }
        }
    }

    componentWillUpdate = (nextProps) => {
        if (!nextProps.isOpen && this.props.isOpen) {
            var app = document.getElementById("app")
            app.style.height = "auto"
            app.style.overflow = "initial"
        }
    }

    // function closeModal(){
    //     var app = document.getElementById("app")
    //     app.style.height = "auto"
    //     app.style.overflow = "initial"
    //     props.onRequestClose()
    // }
    afterOpenModal = (event) => {
        //get height of window    
        var screenHeight = window.innerHeight
        //get height of modal
        var modalContentInstance = document.getElementsByClassName("react-modal")[0]
        var modalInstance = modalContentInstance.parentNode
        var modalHeight = modalContentInstance.clientHeight;

        if (modalHeight > screenHeight) {
            modalInstance.style.position = 'absolute'
            modalInstance.style.height = (modalHeight + 100) + "px"

            app.style.height = (modalHeight + 100) + "px"
            app.style.overflow = "hidden"
        }
    }
    render = () => {
        return (
            <Modal
                className={{
                    base: this.props.className.base + " react-modal",
                    afterOpen: this.props.className.afterOpen + ' modal-open',
                }}
                style={this.state.customStyles}
                isOpen={this.props.isOpen}
                onAfterOpen={this.afterOpenModal.bind(this)}
                onRequestClose={this.props.onRequestClose}
                contentLabel={this.props.contentLabel}
            >
                {this.props.content}
            </Modal>

        )
    }

}

//export default MyModal