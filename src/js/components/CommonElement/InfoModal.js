import React from "react"
import { IDLE_TIME_OUT } from "../../services/constants";
import {Modal} from '../CommonElement'

const InfoModal = (props) => {
  var content = (
    <div className={"p-a-20px"}>
      <div class="title text-center">{props.title}</div>
      <div class="x" onClick={props.closeModal}>&times;</div>
      <div class="content">
          <div class="row">
              <div class="column">
                  <center>
                      <p>
                      {props.content}
                      </p>
                  </center>
              </div>
          </div>
      </div>
    </div>
  )
  return (
    <Modal
      className={
      {
        base: 'reveal tiny',
        afterOpen: 'reveal tiny'
      }}
      content={content}
      isOpen={props.isOpen}
      onRequestClose={props.closeModal}
      size="tiny"
      contentLabel="Info modal"
      />
      
  )
}

export default InfoModal;
