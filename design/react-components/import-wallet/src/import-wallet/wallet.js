import React, { Component } from 'react';
import './wallet.css';
import Modal from 'react-modal';
import Dropzone from 'react-dropzone'
const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 10, 10, 0.45)'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '400px'
    }
};

class Wallet extends React.Component {
        constructor() {
            super();
            this.state = {
                files: [],
                name: "",
                modalIsOpen: false,
            };
            this.openModal = this.openModal.bind(this);
            this.afterOpenModal = this.afterOpenModal.bind(this);
            this.closeModal = this.closeModal.bind(this);

            this.handleNameChange = this.handleNameChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }
        openModal() {
            this.setState({ modalIsOpen: true });
        }

        afterOpenModal() {
            // references are now sync'd and can be accessed.
            //this.subtitle.style.color = '#f00';
        }

        closeModal() {
            this.setState({ modalIsOpen: false });
        }

        onDrop(files) {
            this.setState({
                files: files
            });
        }
        handleNameChange(event) {
            this.setState({
                name: event.target.value
            });
        }
        handleSubmit(event) {
            //   alert('A name was submitted: ' + this.state.value);
            console.log(this.state.name);
            console.log(this.state.files);
            var r = new FileReader();
            r.onloadend = function(e) {
                console.log(e.target.result);
            }
            //M
            r.readAsText(this.state.files[0]);

            event.preventDefault();
            event.stopPropagation();
        }
         render() {
           return (
             <section>
             <div className="k-page-wallet ">
                <div className="import-wallet">
                    <button id="import" className="button" title="Import Wallet" onClick={this.openModal}>
                        +
                    </button>
                </div>
                 <Modal
                  style={customStyles}
                  isOpen={this.state.modalIsOpen}
                  onAfterOpen={this.afterOpenModal}
                  onRequestClose={this.closeModal}         
                  contentLabel="Import Modal"
                >

                <div className="modal-title text-gradient">
                    Import wallet
                </div>
                <div className="modal-body">
                        <form >
                            <div className="row">
                                <div className="large-12 columns">
                                    <label>Name
                                        <input type="text" value={this.state.name} onChange={this.handleNameChange}/>
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="large-12 columns">
                                    <label>Import file                                
                                    </label>
                                    <div className="dropzone">
        					         <Dropzone onDrop={this.onDrop.bind(this)}>
        					           <p className="file-name">
        					           {
        					             this.state.files.map(f => <span key="file-name">{f.name} - {f.size} bytes</span>)
        					          }
        					           </p>
        					         </Dropzone>
        					       </div>					       
                                </div>
                            </div>
                            <div className="row">
                                <div className="large-12 columns submit-button">
                                    <button type="submit" className="button" onClick={this.handleSubmit}>Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>         
                </Modal>      
            </div>       
             </section>
          );
        }
}
//<Basic />
export default Wallet