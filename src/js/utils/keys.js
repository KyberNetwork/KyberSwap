import * as ethUtil from 'ethereumjs-util'
import scrypt from 'scryptsy'
import crypto from 'crypto'



function decipherBuffer(decipher, data) {
  return Buffer.concat([decipher.update(data), decipher.final()])
}

export function addressFromKey(keystring) {
  try {
    var keyObj = JSON.parse(keystring)
    var address = keyObj.address
    if (address == undefined || address == "") {
      throw new Error("Invalid keystore format")
    }
    return "0x" + address
  } catch (e) {
    throw new Error("Invalid keystore format")
  }
}

export function unlock(input, password, nonStrict, translate = null) {
    var json = (typeof input === 'object') ? input : JSON.parse(nonStrict ? input.toLowerCase() : input)
    if (json.version !== 3) {
        throw new Error('Not a V3 wallet')
    }
    var derivedKey
    var kdfparams
    if (json.crypto.kdf === 'scrypt') {
        kdfparams = json.crypto.kdfparams
        derivedKey = scrypt(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
    } else if (json.crypto.kdf === 'pbkdf2') {
        kdfparams = json.crypto.kdfparams
        if (kdfparams.prf !== 'hmac-sha256') {
            throw new Error('Unsupported parameters to PBKDF2')
        }
        derivedKey = crypto.pbkdf2Sync(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256')
    } else {
        throw new Error('Unsupported key derivation scheme')
    }
    var ciphertext = new Buffer(json.crypto.ciphertext, 'hex')
    var mac = ethUtil.keccak(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    if (mac.toString('hex') !== json.crypto.mac) {
        if (translate) {
          throw new Error(translate("error.key_derivation_failed") || 'Key derivation failed - possibly wrong password');
        }
        throw new Error('Key derivation failed - possibly wrong password')
    }
    var decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'))
    var seed = decipherBuffer(decipher, ciphertext, 'hex')
    while (seed.length < 32) {
        var nullBuff = new Buffer([0x00]);
        seed = Buffer.concat([nullBuff, seed]);
    }
    return seed
}

export function addressFromPrivateKey(privateKey){
    var addBuf = ethUtil.privateToAddress(new Buffer(privateKey, 'hex'))
    var addrString = ethUtil.bufferToHex(addBuf)
    return addrString
}