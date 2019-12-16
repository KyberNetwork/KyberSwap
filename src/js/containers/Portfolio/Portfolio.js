import React, { Fragment } from "react";
import { connect } from "react-redux";
import ImportAccount from "../ImportAccount/ImportAccount";
import Chart from 'chart.js';
import { AccountBalance } from "../TransactionCommon";

@connect((store) => {
  return {
    exchange: store.exchange,
    account: store.account.account,
  }
})
export default class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.equityChart = React.createRef();
    this.performanceChart = React.createRef();
  }
  
  componentDidMount() {
    new Chart(this.equityChart.current, {
      type: 'pie',
      data: {
        labels: ['ETH', 'DAI', 'KNC', 'WAX', 'OMG', 'Other'],
        datasets: [{
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: ['#fb497c', '#ffc760', '#67c22b', '#4fccff', '#4d7bf3', '#214e9f']
        }]
      },
      options: {
        legend: {
          position: 'right'
        },
        responsive: false
      }
    });
  
    new Chart(this.performanceChart.current, {
      type: 'line',
      data: {
        labels: ["Nov 19", "Nov 20", "Nov 21", "Nov 22", "Nov 23", "Nov 24", "Nov 25"],
        datasets: [{
          data: [0, 59, 75, 20, 20, 55, 40],
          backgroundColor: 'rgba(30, 137, 193, 0.3)',
          borderColor: '#1e89c1'
        }]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          mode: 'x-axis'
        },
        responsive: false
      }
    });
  }
  
  render() {
    return (
      <div className={"portfolio common__slide-up theme__text"}>
        <div className={"portfolio__left"}>
          <div className={"portfolio__summary"}>
            <div className={"portfolio__account portfolio__item theme__background-2"}>
              {!this.props.account && (
                <ImportAccount
                  tradeType="portfolio"
                  noTerm={true}
                />
              )}
  
              {this.props.account && (
                <Fragment>
                  <div className={"portfolio__account-top"}>
                    <div>
                      <div>
                        <span>Balance</span>
                        <span>Supported tokens</span>
                      </div>
                      <div>5,269.13 ETH</div>
                    </div>
                    <div>
                      <div>
                        <span>24h% change</span>
                        <span>USD</span>
                      </div>
                      <div>-0.877654 ETH 20.87%</div>
                    </div>
                  </div>
                  <div className={"portfolio__account-bot"}>
                    <div>MetaMask: 0xb27frgh782ghuimk54516c…503a</div>
                    <div>Change</div>
                  </div>
                </Fragment>
              )}
            </div>
            
            <div className={"portfolio__equity portfolio__item theme__background-2"}>
              <div className={"portfolio__title"}>Equity</div>
              <canvas width="250" height="200" ref={this.equityChart}/>
            </div>
          </div>
          
          <div className={"portfolio__performance portfolio__item theme__background-2"}>
            <div className={"portfolio__title"}>Portfolio Performance</div>
            <canvas className={"portfolio__performance-chart"} height="200" ref={this.performanceChart}/>
          </div>
          <div className={"portfolio__history portfolio__item theme__background-2"}>
            <div className={"portfolio__title"}>History</div>
            <div className={"portfolio__history-content"}>
              <div className={"portfolio__tx"}>
                <div className={"portfolio__tx-header theme__table-header"}>Today</div>
                <div className={"portfolio__tx-body theme__table-item"}>
                  <div className={"portfolio__tx-left"}>
                    <div className={"portfolio__tx-icon portfolio__tx-icon--swap"}/>
                    <div className={"portfolio__tx-content"}>
                      <div className={"portfolio__tx-bold"}>338.876 KNC ➞ 0.400253 ETH</div>
                      <div className={"portfolio__tx-light theme__text-7"}>1 KNC = 0.001181 ETH</div>
                    </div>
                  </div>
                  <div className={"portfolio__tx-right"}>
                    <div className={"portfolio__tx-type"}>Swap</div>
                    <div className={"portfolio__tx-status portfolio__tx-status--failed"}>Failed</div>
                  </div>
                </div>
  
                <div className={"portfolio__tx-body theme__table-item"}>
                  <div className={"portfolio__tx-left"}>
                    <div className={"portfolio__tx-icon portfolio__tx-icon--receive"}/>
                    <div className={"portfolio__tx-content"}>
                      <div className={"portfolio__tx-bold"}>+ 09,987654532 ETH</div>
                      <div className={"portfolio__tx-light theme__text-7"}>From: 0xbd57e9499013….441f4</div>
                    </div>
                  </div>
                  <div className={"portfolio__tx-right"}>
                    <div className={"portfolio__tx-type"}>Receive</div>
                  </div>
                </div>
  
                <div className={"portfolio__tx-body theme__table-item"}>
                  <div className={"portfolio__tx-left"}>
                    <div className={"portfolio__tx-icon portfolio__tx-icon--limit-order"}/>
                    <div className={"portfolio__tx-content"}>
                      <div className={"portfolio__tx-light theme__text-7"}>Limit Order Triggered</div>
                      <div className={"portfolio__tx-bold"}>1 ETH —> 260.837664 DAI</div>
                    </div>
                  </div>
                  <div className={"portfolio__tx-right"}>
                    <div className={"portfolio__tx-type"}>Limit Order</div>
                  </div>
                </div>
  
                <div className={"portfolio__tx-body theme__table-item"}>
                  <div className={"portfolio__tx-left"}>
                    <div className={"portfolio__tx-icon portfolio__tx-icon--approve"}/>
                    <div className={"portfolio__tx-content"}>
                      <div className={"portfolio__tx-light theme__text-7"}>Token Approved</div>
                      <div className={"portfolio__tx-bold"}>USDT is Approved</div>
                    </div>
                  </div>
                  <div className={"portfolio__tx-right"}>
                    <div className={"portfolio__tx-type"}>Approve</div>
                  </div>
                </div>
  
                <div className={"portfolio__tx-body theme__table-item"}>
                  <div className={"portfolio__tx-left"}>
                    <div className={"portfolio__tx-icon portfolio__tx-icon--send"}/>
                    <div className={"portfolio__tx-content"}>
                      <div className={"portfolio__tx-bold"}>- 02,6784543 ETH</div>
                      <div className={"portfolio__tx-light theme__text-7"}>To: 0xbd57e9499013….441f4</div>
                    </div>
                  </div>
                  <div className={"portfolio__tx-right"}>
                    <div className={"portfolio__tx-type"}>Send</div>
                  </div>
                </div>
              </div>
  
              <div className={"portfolio__tx"}>
                <div className={"portfolio__tx-header theme__table-header"}>10 Mar 2019</div>
                <div className={"portfolio__tx-body theme__table-item"}>
                  <div className={"portfolio__tx-left"}>
                    <div className={"portfolio__tx-icon portfolio__tx-icon--swap"}/>
                    <div className={"portfolio__tx-content"}>
                      <div className={"portfolio__tx-bold"}>338.876 KNC ➞ 0.400253 ETH</div>
                      <div className={"portfolio__tx-light theme__text-7"}>1 KNC = 0.001181 ETH</div>
                    </div>
                  </div>
                  <div className={"portfolio__tx-right"}>
                    <div className={"portfolio__tx-type"}>Swap</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={"portfolio__right portfolio__item theme__background-2"}>
          <AccountBalance
            screen="portfolio"
            hideZeroBalance={true}
            show24hChange={true}
          />
        </div>
      </div>
    )
  }
}
