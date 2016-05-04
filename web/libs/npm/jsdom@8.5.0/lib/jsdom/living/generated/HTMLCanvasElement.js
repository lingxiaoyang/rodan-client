/* */ 
"use strict";
const conversions = require('webidl-conversions');
const utils = require('./utils');
const HTMLElement = require('./HTMLElement');
const impl = utils.implSymbol;
function HTMLCanvasElement() {
  throw new TypeError("Illegal constructor");
}
HTMLCanvasElement.prototype = Object.create(HTMLElement.interface.prototype);
HTMLCanvasElement.prototype.constructor = HTMLCanvasElement;
HTMLCanvasElement.prototype.getContext = function getContext(contextId) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to execute 'getContext' on 'HTMLCanvasElement': 1 argument required, but only " + arguments.length + " present.");
  }
  const args = [];
  for (let i = 0; i < arguments.length; ++i) {
    args[i] = utils.tryImplForWrapper(arguments[i]);
  }
  args[0] = conversions["DOMString"](args[0]);
  return utils.tryWrapperForImpl(this[impl].getContext.apply(this[impl], args));
};
HTMLCanvasElement.prototype.probablySupportsContext = function probablySupportsContext(contextId) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to execute 'probablySupportsContext' on 'HTMLCanvasElement': 1 argument required, but only " + arguments.length + " present.");
  }
  const args = [];
  for (let i = 0; i < arguments.length; ++i) {
    args[i] = utils.tryImplForWrapper(arguments[i]);
  }
  args[0] = conversions["DOMString"](args[0]);
  return utils.tryWrapperForImpl(this[impl].probablySupportsContext.apply(this[impl], args));
};
HTMLCanvasElement.prototype.setContext = function setContext(context) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to execute 'setContext' on 'HTMLCanvasElement': 1 argument required, but only " + arguments.length + " present.");
  }
  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = utils.tryImplForWrapper(arguments[i]);
  }
  return utils.tryWrapperForImpl(this[impl].setContext.apply(this[impl], args));
};
HTMLCanvasElement.prototype.toDataURL = function toDataURL() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  const args = [];
  for (let i = 0; i < arguments.length; ++i) {
    args[i] = utils.tryImplForWrapper(arguments[i]);
  }
  if (args[0] !== undefined) {
    args[0] = conversions["DOMString"](args[0]);
  }
  return utils.tryWrapperForImpl(this[impl].toDataURL.apply(this[impl], args));
};
HTMLCanvasElement.prototype.toBlob = function toBlob(callback) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to execute 'toBlob' on 'HTMLCanvasElement': 1 argument required, but only " + arguments.length + " present.");
  }
  const args = [];
  for (let i = 0; i < arguments.length; ++i) {
    args[i] = utils.tryImplForWrapper(arguments[i]);
  }
  if (args[1] !== undefined) {
    args[1] = conversions["DOMString"](args[1]);
  }
  return utils.tryWrapperForImpl(this[impl].toBlob.apply(this[impl], args));
};
HTMLCanvasElement.prototype.toString = function() {
  if (this === HTMLCanvasElement.prototype) {
    return "[object HTMLCanvasElementPrototype]";
  }
  return HTMLElement.interface.prototype.toString.call(this);
};
Object.defineProperty(HTMLCanvasElement.prototype, "width", {
  get() {
    return utils.tryWrapperForImpl(this[impl].width);
  },
  set(V) {
    V = conversions["unsigned long"](V);
    this[impl].width = utils.tryImplForWrapper(V);
  },
  enumerable: true,
  configurable: true
});
Object.defineProperty(HTMLCanvasElement.prototype, "height", {
  get() {
    return utils.tryWrapperForImpl(this[impl].height);
  },
  set(V) {
    V = conversions["unsigned long"](V);
    this[impl].height = utils.tryImplForWrapper(V);
  },
  enumerable: true,
  configurable: true
});
module.exports = {
  mixedInto: [],
  is(obj) {
    if (obj) {
      if (obj[impl] instanceof Impl.implementation) {
        return true;
      }
      for (let i = 0; i < module.exports.mixedInto.length; ++i) {
        if (obj instanceof module.exports.mixedInto[i]) {
          return true;
        }
      }
    }
    return false;
  },
  isImpl(obj) {
    if (obj) {
      if (obj instanceof Impl.implementation) {
        return true;
      }
      const wrapper = utils.wrapperForImpl(obj);
      for (let i = 0; i < module.exports.mixedInto.length; ++i) {
        if (wrapper instanceof module.exports.mixedInto[i]) {
          return true;
        }
      }
    }
    return false;
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLCanvasElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLCanvasElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    HTMLElement._internalSetup(obj);
  },
  setup(obj, constructorArgs, privateData) {
    if (!privateData)
      privateData = {};
    privateData.wrapper = obj;
    this._internalSetup(obj);
    obj[impl] = new Impl.implementation(constructorArgs, privateData);
    obj[impl][utils.wrapperSymbol] = obj;
  },
  interface: HTMLCanvasElement,
  expose: {Window: {HTMLCanvasElement: HTMLCanvasElement}}
};
const Impl = require('../nodes/HTMLCanvasElement-impl');
