'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';

import { default as transferReducer } from "../../src/js/reducers/transferReducer"

function* specifyAddressReceive(address) {
  yield put({ 
    type: 'TRANSFER.TRANSFER_SPECIFY_ADDRESS_RECEIVE',
    payload: address
  });
}
it('handle specify address receive', () => {
  return expectSaga(specifyAddressReceive, "0x12f0453c1947269842c5646df98905533c1b9519")
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.destAddress).toEqual("0x12f0453c1947269842c5646df98905533c1b9519");
    })
})


function* specifyAmount(amount) {
  yield put({ 
    type: 'TRANSFER.TRANSFER_SPECIFY_AMOUNT',
    payload: amount
  });
}
it('handle specify amount', () => {
  return expectSaga(specifyAmount, 1)
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.amount).toEqual(1);
    })
})


function* selectToken(symbol, address) {
  yield put({ 
    type: 'TRANSFER.SELECT_TOKEN',
    payload: {
      symbol: symbol,
      address: address
    }
  });
}
it('handle select token', () => {
  return expectSaga(selectToken, "ETH", "0x12f0453c1947269842c5646df98905533c1b9519")
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.tokenSymbol).toEqual("ETH");
      expect(result.storeState.token).toEqual("0x12f0453c1947269842c5646df98905533c1b9519");
      expect(result.storeState.selected).toEqual(true);
    })
})


function* specifyGas(gas) {
  yield put({ 
    type: 'TRANSFER_SPECIFY_GAS',
    payload: gas
  });
}
it('handle specify gass', () => {
  return expectSaga(specifyGas, 2000000)
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.gas).toEqual(2000000);
    })
})


function* specifyGasPrice(gasPrice) {
  yield put({ 
    type: 'TRANSFER_SPECIFY_GAS_PRICE',
    payload: gasPrice
  });
}
it('handle specify gass price', () => {
  return expectSaga(specifyGasPrice, 25)
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.gasPrice).toEqual(25);
    })
})


function* openPassphrase() {
  yield put({ 
    type: 'TRANSFER.OPEN_PASSPHRASE'
  });
}
it('handle open passphrase', () => {
  return expectSaga(openPassphrase)
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.passphrase).toEqual(true);
    })
})


function* hidePassphrase() {
  yield put({ 
    type: 'TRANSFER.HIDE_PASSPHRASE'
  });
}
it('handle hide passphrase', () => {
  return expectSaga(hidePassphrase)
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.passphrase).toEqual(false);
    })
})


function* showConfirm() {
  yield put({ 
    type: 'TRANSFER.SHOW_CONFIRM'
  });
}
it('handle show confirm', () => {
  return expectSaga(showConfirm)
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.confirmColdWallet).toEqual(true);
    })
})

function* hideConfirm() {
  yield put({ 
    type: 'TRANSFER.HIDE_CONFIRM'
  });
}
it('handle hide confirm', () => {
  return expectSaga(hideConfirm)
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.confirmColdWallet).toEqual(false);
    })
})


function* throwErrorPassphrases(message) {
  yield put({ 
    type: 'TRANSFER.THROW_ERROR_PASSPHRASE',
    payload: message
  });
}
it('handle throw error passphrase', () => {
  return expectSaga(throwErrorPassphrases, "wrong passphare")
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.errors.passwordError).toEqual("wrong passphare");
    })
})



function* throwErrorDessAddress(message) {
  yield put({ 
    type: 'TRANSFER.THROW_ERROR_DEST_ADDRESS',
    payload: message
  });
}
it('handle throw error dest address', () => {
  return expectSaga(throwErrorDessAddress, "This is not an address")
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.errors.destAddress).toEqual("This is not an address");
    })
})


function* throwAmountError(message) {
  yield put({ 
    type: 'TRANSFER.THROW_AMOUNT_ERROR',
    payload: message
  });
}
it('handle throw amount error', () => {
  return expectSaga(throwAmountError, "Amount must be a number")
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.errors.amountTransfer).toEqual("Amount must be a number");
    })
})


function* txBroadcasstRejected(message) {
  yield put({ 
    type: 'TRANSFER.TX_BROADCAST_REJECTED',
    payload: message
  });
}
it('handle throw broadcass rejected', () => {
  return expectSaga(txBroadcasstRejected, "Gas too low..")
    .withReducer(transferReducer)
    .run()
    .then((result) => {
      expect(result.storeState.bcError).toEqual("Gas too low..");
    })
})