import React from "react"
export default class SortableTh extends React.Component {
  constructor() {
    super()
    this.state = { is_asc: true }
  }
  onSort = (isAsc) => {
    const { isEnable } = this.props
    this.props.onSort(isEnable ? !this.state.is_asc : true)
    this.setState((state, props) => ({is_asc: (isEnable ? !state.is_asc : true)}))
  }
  render() {
    const { children, isEnable } = this.props
    const { is_asc } = this.state
    return (
      <th width={this.props.width} onClick={() => this.onSort(is_asc)}> 
        {children} 
        <img src={ isEnable ? (is_asc ? require("../../../../assets/img/limit-order/sort-asc-icon.svg") : 
          require("../../../../assets/img/limit-order/sort-desc-icon.svg")) : "" }/>
      </th>
    )
  } 
}

