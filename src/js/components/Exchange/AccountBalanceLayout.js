import React from "react"
import * as converts from "../../utils/converter"
import { MINIMUM_DISPLAY_BALANCE } from "../../services/constants"
import BLOCKCHAIN_INFO from "../../../../env"
import SlideDown, { SlideDownContent } from "../CommonElement/SlideDown";
import { Modal, SortableComponent } from "../CommonElement"
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactTooltip from "react-tooltip";
import QRCode from "qrcode.react";

const AccountBalanceLayout = (props) => {
  const isPortfolio = props.screen === 'portfolio';
  const allBalances = getBalances();
  const isHideAllInfo = props.hideZeroBalance && allBalances === false;

  function get24ChangeClass(change, isValidRate) {
    if (isValidRate && change > 0) {
      return 'account-balance__token-row--positive';
    } else if (isValidRate && change < 0) {
      return 'account-balance__token-row--negative';
    } else {
      return ''
    }
  }

  function get24ChangeValue(sortType, tokenSymbol, isValidRate) {
    if (sortType === 'ETH') {
      let changeByETH = props.getChangeByETH(tokenSymbol);
      return <div className={`account-balance__token-row ${get24ChangeClass(changeByETH, isValidRate)}`}>{(isValidRate) ? `${changeByETH}%` : '---'}</div>
    }

    const changeByUSD = props.getChangeByUSD(tokenSymbol);
    return <div className={`account-balance__token-row ${get24ChangeClass(changeByUSD, isValidRate)}`}>{(isValidRate) ? `${changeByUSD}%` : '---'}</div>
  }

  function getBalances() {
    const tokens = props.getCustomizedTokens();
    let isEmpty = true;

    const allBalances = tokens.map(token => {
      var balance = converts.toT(token.balance, token.decimals)
      var searchWord = props.searchWord.toLowerCase()
      var symbolL = token.symbol.toLowerCase()
      let classBalance = "";
      const noBalance = balance == 0;
      const isValidRate = token.symbol === "ETH" || converts.compareTwoNumber(token.rate, 0);
      const balanceInETH = converts.formatNumber(token.balanceInETH || 0, 6);
      const balanceInUSD = converts.toT(converts.multiplyOfTwoNumber(balance, token.rateUSD), "0", 2);
      const hideZeroBalance = props.hideZeroBalance && (noBalance || balanceInETH < MINIMUM_DISPLAY_BALANCE);

      if (!symbolL.includes(searchWord) || hideZeroBalance) return null;
      isEmpty = false;

      if (token.symbol === props.sourceActive) classBalance += " active";

      if (props.isLimitOrderTab && (!token.sp_limit_order || !props.isValidPriority(token))) {
        classBalance += " disabled unclickable"
      } else if (noBalance) {
        classBalance += " disabled"
      }

      if ((props.isFixedSourceToken && props.screen === "swap") || (token.symbol === "PT" && props.screen === "transfer")) {
        classBalance += " deactivated";
      }

      return (
        <div key={token.symbol} className={isPortfolio ? "account-balance__token-wrapper theme__token-item" : "account-balance__token-wrapper"}>
          <div
            {...(!classBalance.includes('unclickable') && { onClick: (e) => props.selectBalance(props.isLimitOrderTab ? (token.symbol === "ETH" ? "WETH" : token.symbol) : (token.symbol)) })}
            className={"account-balance__token-item" + classBalance}
          >
            <div className={"account-balance__token-row account-balance__token-info"}>
              <img src={"https://files.kyberswap.com/DesignAssets/tokens/" + (token.substituteImage ? token.substituteImage : token.symbol).toLowerCase() + ".svg"} />
              <div>
                <div className="account-balance__token-symbol">{token.substituteSymbol ? token.substituteSymbol : token.symbol}</div>
                <div className="account-balance__token-balance theme__text-3">{converts.formatNumber(balance, 5)}</div>
              </div>
            </div>
            {
              (isValidRate) ?
                (<div className="account-balance__token-row stable-equivalent">{
                  props.sortType === "ETH" ? `${balanceInETH} E` : `${balanceInUSD}$`
                }</div>) :
                (<div className="account-balance__token-row stable-equivalent">
                  {props.hideZeroBalance && (
                    <span>---</span>
                  )}

                  {!props.hideZeroBalance && (
                    <span className="error">maintenance</span>
                  )}
                </div>)
            }
            {props.show24hChange && get24ChangeValue(props.sortType, token.symbol, isValidRate)}
          </div>

          {!props.isOnMobile && <div class="account-balance__item-hover-overlay">
            {token.symbol !== "PT" && <button className="buy" onClick={(e) => props.selectBalanceButton("buy", token.symbol)}>BUY</button>}
            <button className="sell" onClick={(e) => props.selectBalanceButton("sell", token.symbol)}>SELL</button>
            {/* <button className="transfer" onClick={(e) => props.selectBalanceButton("transfer", token.symbol)}>TRANSFER</button> */}
          </div>}
        </div>
      )
    });

    return !isEmpty || props.searchWord ? allBalances : false;
  }

  return (
    <div className={`account-balance common__slide-up account-balance--${props.screen}`}>
      {props.account !== false && (
        <SlideDown active={true}>
          <SlideDownContent>
            {!isPortfolio && (
              <div className="balance-header">
                <div className="slide-down__trigger-container">
                  <div className={"account-balance__address"}>
                    <div className="account-balance__address-text">{props.translate("address.your_wallet") || "Wallet"}</div>
                    <div>
                      <a className="account-balance__address-link theme__text-3" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + props.account.address}
                        onClick={(e) => { props.analytics.callTrack("trackClickShowAddressOnEtherescan"); e.stopPropagation(); }}>
                        {props.account.address.slice(0, 10)}...{props.account.address.slice(-4)}
                      </a>
                      <a data-for='copy-address-tooltip' data-tip="" onClick={() => props.setIsAddressCopied(true)} onMouseLeave={() => props.setIsAddressCopied(false)}>
                        <CopyToClipboard text={props.account.address}>
                          <img className="account-balance__icon copy" src={require("../../../assets/img/copy-address.svg")}/>
                        </CopyToClipboard>
                        <ReactTooltip id="copy-address-tooltip" className="account-balance__tooltip">
                          {props.isAddressCopied ? 'Copied!' : 'Copy Address'}
                        </ReactTooltip>
                      </a>
                      <img className="account-balance__icon" onClick={() => props.setIsAddressQROpened(true)} src={require("../../../assets/img/qr-code.svg")}/>
                      <Modal
                        className={{ base: 'reveal small', afterOpen: 'reveal small' }}
                        isOpen={props.isAddressQROpened}
                        onRequestClose={() => props.setIsAddressQROpened(false)}
                        contentLabel="Scan Address QR"
                        content={(
                          <div className="reimport-modal p-a-20px">
                            <div className="x" onClick={() => props.setIsAddressQROpened(false)}>&times;</div>
                            <div className="title">Scan Address QR</div>
                            <div className="common__text-center">
                              <QRCode
                                value={props.account.address}
                                className="account-balance__qr-code"
                              />
                            </div>
                            <div className="content">
                              <div className="button cancel-btn" onClick={() => props.setIsAddressQROpened(false)}>Cancel</div>
                            </div>
                          </div>
                        )}
                      />
                      <span className="account-balance__reimport" onClick={props.openReImport}>
                        {props.translate("change") || "CHANGE"}
                      </span>
                    </div>
                    {props.isLimitOrderTab &&
                      <div className="account-balance__address-text">
                        {props.translate("limit_order.your_available_balance") || "Tokens Available for Limit Order"}
                      </div>
                    }
                  </div>
                </div>
              </div>
            )}

            <div className="account-balance__control-panel">
              <div className={`account-balance__search-panel ${props.hideZeroBalance ? 'common__flexbox' : ''}`}>
                {props.hideZeroBalance && (
                  <div className="account-balance__text-panel">All Tokens</div>
                )}

                {!isHideAllInfo && (
                  <div className="account-balance__content-search-container">
                    <input
                      className="account-balance__content-search theme__search"
                      type="text"
                      placeholder={props.translate("address.search") || "Search by Name"}
                      onClick={props.clickOnInput}
                      onChange={(e) => props.changeSearchBalance(e)}
                      value={props.searchWord}
                    />
                  </div>
                )}
              </div>

              {!isHideAllInfo && (
                <div className="account-balance__sort-panel theme__background-4">
                  <div>
                    <SortableComponent
                      text="Name"
                      Wrapper="span"
                      isActive={props.sortName === "Name"}
                      onClick={(isDsc) => props.onClickSort(false, "Name", isDsc)}
                    />
                    <span className="account-balance__sort-separation theme__separation"> | </span>
                    <SortableComponent
                      text="Bal"
                      Wrapper="span"
                      isActive={props.sortName === "Bal"}
                      onClick={(isDsc) => props.onClickSort(false, "Bal", isDsc)}
                    />
                  </div>
                  <div>
                    <SortableComponent
                      text="ETH"
                      Wrapper="span"
                      isActive={props.sortType === "ETH"}
                      onClick={(isDsc) => props.onClickSort("ETH", '', isDsc)}
                      showArrow={props.sortName === ''}
                    />
                    <span className="account-balance__sort-separation theme__separation"> | </span>
                    <SortableComponent
                      text="USD"
                      Wrapper="span"
                      isActive={props.sortType === "USD"}
                      onClick={(isDsc) => props.onClickSort("USD", '', isDsc)}
                      showArrow={props.sortName === ''}
                    />
                  </div>
                  {props.show24hChange && (
                    <SortableComponent
                      text={props.translate("change") || "Change"}
                      Wrapper="span"
                      isActive={props.sortName === "Change"}
                      onClick={(isDsc) => props.onClickSort(false, "Change", isDsc)}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="account-balance__content">
              <div>
                <div className="balances custom-radio">
                  <div className={`account-balance__token-list ${isHideAllInfo ? 'account-balance__token-list--empty' : ''}`}>
                    {!isHideAllInfo ? allBalances : '-- % --'}
                  </div>
                </div>
              </div>
            </div>
          </SlideDownContent>
        </SlideDown>
      )}
    </div>
  )
};

export default AccountBalanceLayout
