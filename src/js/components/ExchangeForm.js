import React from "react";

import UserSelect from "./ExchangeForm/UserSelect";
import TokenSource from "./ExchangeForm/TokenSource";
import TokenDest from "./ExchangeForm/TokenDest";
import ExchangeRate from "./ExchangeForm/ExchangeRate";
import RecipientSelect from "./ExchangeForm/RecipientSelect";
import TransactionConfig from "./ExchangeForm/TransactionConfig";
import Credential from "./ExchangeForm/Credential";
import PostExchange from "./ExchangeForm/PostExchange";


export default class ExchangeForm extends React.Component {
  render() {
    return (
    <div>
      <form>
        <UserSelect />
        <TokenSource />
        <TokenDest />
        <ExchangeRate />
        <RecipientSelect />
        <TransactionConfig />
        <Credential />
        <PostExchange />
      </form>
    </div>)
  }
}
