import React  from "react"

const InlineLoading = (props) => {
  return (
    <div className="inline-loading">
      <img className="inline-loading__icon" src={require(`../../../assets/img/${props.theme === 'dark' ? 'waiting-black' : 'waiting-white'}.svg`)} />
      <div className="inline-loading__text theme__text">loading...</div>
    </div>
  )
};

export default InlineLoading
