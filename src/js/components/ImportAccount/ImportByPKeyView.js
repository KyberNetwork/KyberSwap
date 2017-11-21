import React from "react"
import { Modal } from '../CommonElement'

const ImportByPKeyView = (props) => {

    function handldeSubmit(e) {
        e.preventDefault()
        props.importPrivateKey()
    }

    return (
        <div class="column column-block">
            <div class="importer pkey">
                <a onClick={() => props.modalOpen()}>
                    <img src="/assets/img/pkey.svg" />
                    <div class="description">Enter your<br />private key</div>
                </a>
            </div>

            <Modal
                className={{ base: 'reveal tiny', afterOpen: 'reveal tiny' }}
                isOpen={props.isOpen}
                onRequestClose={() => props.onRequestClose()}
                content={
                    <div>
                        <div class="title">ENTER YOUR PRIVATE KEY</div><a class="x" onClick={props.onRequestClose}>&times;</a>
                        <form onSubmit={(e) => handldeSubmit(e)}>
                            <div class="content with-overlap">
                                <div class="row">
                                    <div class="column">
                                        <center>
                                            <input class="text-center" type="password" id="private_key" placeholder="Enter your private key" required />
                                        </center>
                                    </div>
                                </div>
                            </div>
                            <div class="overlap">
                                <button type="submit" class="button accent">Import</button>
                            </div>
                        </form>
                    </div>
                }
            />
        </div>
    )
}

export default ImportByPKeyView