import React from "react"

const AddressBalance = (props) => {

  // resetMinRate = (e)=>{
  //   this.props.dispatch(actions.resetMinRate())
  //   //this.props.dispatch(actions.caculateAmount())
  // }

  function moveCursor() {
    let inp = document.getElementById('inputSource')
    //inp.focus();
    if (inp.createTextRange) {
      var part = inp.createTextRange();
      part.move("character", 0);
      part.select();
    } else if (inp.setSelectionRange) {
      inp.setSelectionRange(0, 0);
    }
  }

  return (
    <div class="address-balance">
      <p class="note">{props.translate("transaction.address_balance") || "Address Balance"}</p>
      <div>
        <span>{props.translate("transaction.click_to_ex_all_balance") || "Click to swap all balance"}</span>
        <span className="balance" title={props.balance.value} onClick={() => {
          props.setAmount()
          setTimeout(moveCursor, 0);
        }}>
          {props.balance.roundingValue}
        </span>
      </div>
    </div>
  )
}

export default AddressBalance