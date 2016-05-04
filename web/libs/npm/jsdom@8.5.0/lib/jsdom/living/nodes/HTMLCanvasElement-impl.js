/* */ 
"use strict";
const HTMLElementImpl = require('./HTMLElement-impl').implementation;
const notImplemented = require('../../browser/not-implemented');
const idlUtils = require('../generated/utils');
const Canvas = require('../../utils').Canvas;
class HTMLCanvasElementImpl extends HTMLElementImpl {
  _attrModified(name, value) {
    if (this._canvas && (name === "width" || name === "height")) {
      this._canvas[name] = parseInt(value);
    }
    return super._attrModified.apply(this, arguments);
  }
  _getCanvas() {
    if (Canvas && !this._canvas) {
      this._canvas = new Canvas(this.width, this.height);
    }
    return this._canvas;
  }
  getContext(contextId) {
    const canvas = this._getCanvas();
    if (canvas) {
      if (!this._context) {
        this._context = canvas.getContext(contextId) || null;
        if (this._context) {
          this._context.canvas = idlUtils.wrapperForImpl(this);
          wrapNodeCanvasMethod(this._context, "createPattern");
          wrapNodeCanvasMethod(this._context, "drawImage");
        }
      }
      return this._context;
    }
    notImplemented("HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)", this._ownerDocument._defaultView);
    return null;
  }
  probablySupportsContext(contextId) {
    const canvas = this._getCanvas();
    return canvas ? contextId === "2d" : false;
  }
  setContext() {
    notImplemented("HTMLCanvasElement.prototype.setContext");
  }
  toDataURL() {
    const canvas = this._getCanvas();
    if (canvas) {
      return canvas.toDataURL.apply(this._canvas, arguments);
    }
    notImplemented("HTMLCanvasElement.prototype.toDataURL (without installing the canvas npm package)", this._ownerDocument._defaultView);
    return null;
  }
  toBlob(callback, type, qualityArgument) {
    const window = this._ownerDocument._defaultView;
    const canvas = this._getCanvas();
    if (canvas) {
      let stream;
      switch (type) {
        case "image/jpg":
        case "image/jpeg":
          stream = canvas.createJPEGStream({quality: Math.min(0, Math.max(1, qualityArgument)) * 100});
          break;
        default:
          type = "image/png";
          stream = canvas.createPNGStream();
      }
      const buffers = [];
      stream.on("data", (chunk) => {
        buffers.push(chunk);
      });
      stream.on("end", () => {
        callback(new window.Blob(buffers, {type}));
      });
    } else {
      notImplemented("HTMLCanvasElement.prototype.toBlob (without installing the canvas npm package)", window);
    }
  }
  get width() {
    const parsed = parseInt(this.getAttribute("width"));
    return isNaN(parsed) || parsed < 0 || parsed > 2147483647 ? 300 : parsed;
  }
  set width(v) {
    v = v > 2147483647 ? 300 : v;
    this.setAttribute("width", String(v));
  }
  get height() {
    const parsed = parseInt(this.getAttribute("height"));
    return isNaN(parsed) || parsed < 0 || parsed > 2147483647 ? 150 : parsed;
  }
  set height(v) {
    v = v > 2147483647 ? 150 : v;
    this.setAttribute("height", String(v));
  }
}
function wrapNodeCanvasMethod(ctx, name) {
  const prev = ctx[name];
  ctx[name] = function(image) {
    const impl = idlUtils.implForWrapper(image);
    if (impl) {
      arguments[0] = impl._image || impl._canvas;
    }
    return prev.apply(ctx, arguments);
  };
}
module.exports = {implementation: HTMLCanvasElementImpl};
