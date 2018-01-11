import React from "react"
import { IDLE_TIME_OUT } from "../../services/constants";
import {Modal} from '../CommonElement'

const InfoModal = (props) => {
  var title = props.title ? props.title : ''
  var content = props.content ? props.content : ''
  var content = (
    <div>
      <div class="title text-center">{props.translate(title)}</div><a class="x" onClick={props.closeModal}>&times;</a>
      <div class="content">
          <div class="row">
              <div class="column">
                  <center>
                      <p>{props.translate(content, {time: IDLE_TIME_OUT/60} )}</p>
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