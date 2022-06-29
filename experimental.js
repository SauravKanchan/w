import {ethers as ethers2} from "/-/ethers@v5.6.9-ozcTuS8ccMsRkw85AIJT/dist=es2019,mode=imports/optimized/ethers.js";
import scrypt from "/-/scrypt-js@v3.0.1-i7o5WRRoCSQdh1RlLmux/dist=es2019,mode=imports/optimized/scrypt-js.js";
const version = "experimental/5.6.3";
const logger = new ethers2.utils.Logger(version);
let warned = false;
class BrainWallet extends ethers2.Wallet {
  static _generate(username, password, legacy, progressCallback) {
    if (!warned) {
      logger.warn("Warning: using Brain Wallets should be considered insecure (this warning will not be repeated)");
      warned = true;
    }
    let usernameBytes = null;
    let passwordBytes = null;
    if (typeof username === "string") {
      logger.checkNormalize();
      usernameBytes = ethers2.utils.toUtf8Bytes(username.normalize("NFKC"));
    } else {
      usernameBytes = ethers2.utils.arrayify(username);
    }
    if (typeof password === "string") {
      logger.checkNormalize();
      passwordBytes = ethers2.utils.toUtf8Bytes(password.normalize("NFKC"));
    } else {
      passwordBytes = ethers2.utils.arrayify(password);
    }
    return scrypt.scrypt(passwordBytes, usernameBytes, 1 << 18, 8, 1, 32, progressCallback).then((key) => {
      if (legacy) {
        return new BrainWallet(key);
      }
      const mnemonic = ethers2.utils.entropyToMnemonic(ethers2.utils.arrayify(key).slice(0, 16));
      return new BrainWallet(ethers2.Wallet.fromMnemonic(mnemonic));
    });
  }
  static generate(username, password, progressCallback) {
    return BrainWallet._generate(username, password, false, progressCallback);
  }
  static generateLegacy(username, password, progressCallback) {
    return BrainWallet._generate(username, password, true, progressCallback);
  }
}
class NonceManager extends ethers2.Signer {
  constructor(signer) {
    super();
    this._deltaCount = 0;
    ethers2.utils.defineReadOnly(this, "signer", signer);
    ethers2.utils.defineReadOnly(this, "provider", signer.provider || null);
  }
  connect(provider) {
    return new NonceManager(this.signer.connect(provider));
  }
  getAddress() {
    return this.signer.getAddress();
  }
  getTransactionCount(blockTag) {
    if (blockTag === "pending") {
      if (!this._initialPromise) {
        this._initialPromise = this.signer.getTransactionCount("pending");
      }
      const deltaCount = this._deltaCount;
      return this._initialPromise.then((initial) => initial + deltaCount);
    }
    return this.signer.getTransactionCount(blockTag);
  }
  setTransactionCount(transactionCount) {
    this._initialPromise = Promise.resolve(transactionCount).then((nonce) => {
      return ethers2.BigNumber.from(nonce).toNumber();
    });
    this._deltaCount = 0;
  }
  incrementTransactionCount(count) {
    this._deltaCount += count == null ? 1 : count;
  }
  signMessage(message) {
    return this.signer.signMessage(message);
  }
  signTransaction(transaction) {
    return this.signer.signTransaction(transaction);
  }
  sendTransaction(transaction) {
    if (transaction.nonce == null) {
      transaction = ethers2.utils.shallowCopy(transaction);
      transaction.nonce = this.getTransactionCount("pending");
      this.incrementTransactionCount();
    } else {
      this.setTransactionCount(transaction.nonce);
      this._deltaCount++;
    }
    return this.signer.sendTransaction(transaction).then((tx) => {
      return tx;
    });
  }
}
var domain;
function EventHandlers() {
}
EventHandlers.prototype = Object.create(null);
function EventEmitter() {
  EventEmitter.init.call(this);
}
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.usingDomains = false;
EventEmitter.prototype.domain = void 0;
EventEmitter.prototype._events = void 0;
EventEmitter.prototype._maxListeners = void 0;
EventEmitter.defaultMaxListeners = 10;
EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    if (domain.active)
      ;
  }
  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || void 0;
};
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== "number" || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};
function $getMaxListeners(that) {
  if (that._maxListeners === void 0)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self, arg1, arg2, arg3);
  }
}
function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].apply(self, args);
  }
}
EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain2;
  var doError = type === "error";
  events = this._events;
  if (events)
    doError = doError && events.error == null;
  else if (!doError)
    return false;
  domain2 = this.domain;
  if (doError) {
    er = arguments[1];
    if (domain2) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain2;
      er.domainThrown = false;
      domain2.emit("error", er);
    } else if (er instanceof Error) {
      throw er;
    } else {
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
      err.context = er;
      throw err;
    }
    return false;
  }
  handler = events[type];
  if (!handler)
    return false;
  var isFn = typeof handler === "function";
  len = arguments.length;
  switch (len) {
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }
  return true;
};
function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  if (typeof listener !== "function")
    throw new TypeError('"listener" argument must be a function');
  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    if (events.newListener) {
      target.emit("newListener", type, listener.listener ? listener.listener : listener);
      events = target._events;
    }
    existing = events[type];
  }
  if (!existing) {
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === "function") {
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
    } else {
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + type + " listeners added. Use emitter.setMaxListeners() to increase limit");
        w.name = "MaxListenersExceededWarning";
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }
  return target;
}
function emitWarning(e) {
  typeof console.warn === "function" ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};
function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}
EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== "function")
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  if (typeof listener !== "function")
    throw new TypeError('"listener" argument must be a function');
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  if (typeof listener !== "function")
    throw new TypeError('"listener" argument must be a function');
  events = this._events;
  if (!events)
    return this;
  list = events[type];
  if (!list)
    return this;
  if (list === listener || list.listener && list.listener === listener) {
    if (--this._eventsCount === 0)
      this._events = new EventHandlers();
    else {
      delete events[type];
      if (events.removeListener)
        this.emit("removeListener", type, list.listener || listener);
    }
  } else if (typeof list !== "function") {
    position = -1;
    for (i = list.length; i-- > 0; ) {
      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }
    if (position < 0)
      return this;
    if (list.length === 1) {
      list[0] = void 0;
      if (--this._eventsCount === 0) {
        this._events = new EventHandlers();
        return this;
      } else {
        delete events[type];
      }
    } else {
      spliceOne(list, position);
    }
    if (events.removeListener)
      this.emit("removeListener", type, originalListener || listener);
  }
  return this;
};
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners2, events;
  events = this._events;
  if (!events)
    return this;
  if (!events.removeListener) {
    if (arguments.length === 0) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    } else if (events[type]) {
      if (--this._eventsCount === 0)
        this._events = new EventHandlers();
      else
        delete events[type];
    }
    return this;
  }
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    for (var i = 0, key; i < keys.length; ++i) {
      key = keys[i];
      if (key === "removeListener")
        continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners("removeListener");
    this._events = new EventHandlers();
    this._eventsCount = 0;
    return this;
  }
  listeners2 = events[type];
  if (typeof listeners2 === "function") {
    this.removeListener(type, listeners2);
  } else if (listeners2) {
    do {
      this.removeListener(type, listeners2[listeners2.length - 1]);
    } while (listeners2[0]);
  }
  return this;
};
EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;
  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === "function")
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }
  return ret;
};
EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === "function") {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;
  if (events) {
    var evlistener = events[type];
    if (typeof evlistener === "function") {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}
function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const logger$1 = new ethers2.utils.Logger(version);
class Eip1193Bridge extends EventEmitter {
  constructor(signer, provider) {
    super();
    ethers2.utils.defineReadOnly(this, "signer", signer);
    ethers2.utils.defineReadOnly(this, "provider", provider || null);
  }
  request(request) {
    return this.send(request.method, request.params || []);
  }
  send(method, params) {
    return __awaiter(this, void 0, void 0, function* () {
      function throwUnsupported(message) {
        return logger$1.throwError(message, ethers2.utils.Logger.errors.UNSUPPORTED_OPERATION, {
          method,
          params
        });
      }
      let coerce = (value) => value;
      switch (method) {
        case "eth_gasPrice": {
          const result = yield this.provider.getGasPrice();
          return result.toHexString();
        }
        case "eth_accounts": {
          const result = [];
          if (this.signer) {
            const address = yield this.signer.getAddress();
            result.push(address);
          }
          return result;
        }
        case "eth_blockNumber": {
          return yield this.provider.getBlockNumber();
        }
        case "eth_chainId": {
          const result = yield this.provider.getNetwork();
          return ethers2.utils.hexValue(result.chainId);
        }
        case "eth_getBalance": {
          const result = yield this.provider.getBalance(params[0], params[1]);
          return result.toHexString();
        }
        case "eth_getStorageAt": {
          return this.provider.getStorageAt(params[0], params[1], params[2]);
        }
        case "eth_getTransactionCount": {
          const result = yield this.provider.getTransactionCount(params[0], params[1]);
          return ethers2.utils.hexValue(result);
        }
        case "eth_getBlockTransactionCountByHash":
        case "eth_getBlockTransactionCountByNumber": {
          const result = yield this.provider.getBlock(params[0]);
          return ethers2.utils.hexValue(result.transactions.length);
        }
        case "eth_getCode": {
          const result = yield this.provider.getBlock(params[0]);
          return result;
        }
        case "eth_sendRawTransaction": {
          return yield this.provider.sendTransaction(params[0]);
        }
        case "eth_call": {
          const req = ethers2.providers.JsonRpcProvider.hexlifyTransaction(params[0]);
          return yield this.provider.call(req, params[1]);
        }
        case "estimateGas": {
          if (params[1] && params[1] !== "latest") {
            throwUnsupported("estimateGas does not support blockTag");
          }
          const req = ethers2.providers.JsonRpcProvider.hexlifyTransaction(params[0]);
          const result = yield this.provider.estimateGas(req);
          return result.toHexString();
        }
        case "eth_getBlockByHash":
        case "eth_getBlockByNumber": {
          if (params[1]) {
            return yield this.provider.getBlockWithTransactions(params[0]);
          } else {
            return yield this.provider.getBlock(params[0]);
          }
        }
        case "eth_getTransactionByHash": {
          return yield this.provider.getTransaction(params[0]);
        }
        case "eth_getTransactionReceipt": {
          return yield this.provider.getTransactionReceipt(params[0]);
        }
        case "eth_sign": {
          if (!this.signer) {
            return throwUnsupported("eth_sign requires an account");
          }
          const address = yield this.signer.getAddress();
          if (address !== ethers2.utils.getAddress(params[0])) {
            logger$1.throwArgumentError("account mismatch or account not found", "params[0]", params[0]);
          }
          return this.signer.signMessage(ethers2.utils.arrayify(params[1]));
        }
        case "eth_sendTransaction": {
          if (!this.signer) {
            return throwUnsupported("eth_sendTransaction requires an account");
          }
          const req = ethers2.providers.JsonRpcProvider.hexlifyTransaction(params[0]);
          const tx = yield this.signer.sendTransaction(req);
          return tx.hash;
        }
        case "eth_getUncleCountByBlockHash":
        case "eth_getUncleCountByBlockNumber": {
          coerce = ethers2.utils.hexValue;
          break;
        }
      }
      if (this.provider.send) {
        const result = yield this.provider.send(method, params);
        return coerce(result);
      }
      return throwUnsupported(`unsupported method: ${method}`);
    });
  }
}
export {BrainWallet, Eip1193Bridge, NonceManager};
export default null;
