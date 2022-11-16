function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var PixiStats = /*#__PURE__*/function () {
  function PixiStats(main, pixi, app, options) {
    _classCallCheck(this, PixiStats);

    this.pixi = pixi;
    this.main = main;
    this.app = app;
    this.hijackedGL = false;
    var defaultConfig = {
      maxMemorySize: 350,
      COLOR_MEM_TEXTURE: '#8ddcff',
      COLOR_MEM_BUFFER: '#ffd34d'
    };
    this.config = Object.assign(defaultConfig, options);
    this.config.baseCanvasWidth = 100 * this.main.config.scale, this.config.baseCanvasHeight = 80 * this.main.config.scale, this.memGraph = {
      width: this.config.baseCanvasWidth,
      height: this.config.baseCanvasHeight * 0.38,
      drawY: this.config.baseCanvasHeight * 0.50,
      barWidth: this.config.baseCanvasWidth / this.main.config.maximumHistory
    };
    this.dom;
    this.canvas;
    this.ctx;
    this.graphYOffset = 0;
    this.tempDrawCalls = 0;
    this.drawCalls = 0;
    this.realGLDrawElements = null;
    this.init();
  }

  _createClass(PixiStats, [{
    key: "init",
    value: function init() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = this.config.baseCanvasWidth;
      this.canvas.height = this.config.baseCanvasHeight;
      this.canvas.style.cssText = "width:".concat(this.config.baseCanvasWidth * this.main.config.scale, "px;height:").concat(this.config.baseCanvasHeight * this.main.config.scale, "px;background-color:").concat(this.main.config.COLOR_BG);
      this.main.dom.appendChild(this.canvas);
      this.update = this.update.bind(this);
      this.update();
    }
  }, {
    key: "collectStats",
    value: function collectStats() {
      var _formatToSize;

      var formatToSize = (_formatToSize = {}, _defineProperty(_formatToSize, this.pixi.FORMATS.RGB, 3), _defineProperty(_formatToSize, this.pixi.FORMATS.RGBA, 4), _defineProperty(_formatToSize, this.pixi.FORMATS.DEPTH_COMPONENT, 3), _defineProperty(_formatToSize, this.pixi.FORMATS.DEPTH_STENCIL, 4), _defineProperty(_formatToSize, this.pixi.FORMATS.ALPHA, 1), _defineProperty(_formatToSize, this.pixi.FORMATS.LUMINANCE, 1), _defineProperty(_formatToSize, this.pixi.FORMATS.LUMINANCE_ALPHA, 2), _formatToSize);
      var textures = this.app.renderer.texture.managedTextures;
      var buffers = this.app.renderer.buffer ? this.app.renderer.buffer.managedBuffers : this.app.renderer.geometry.managedBuffers;
      var rts = this.app.renderer.framebuffer.managedFramebuffers;
      var textureTotalMem = 0;

      for (var key in textures) {
        var t = textures[key];
        textureTotalMem += t.width * t.height * formatToSize[t.format];
      }

      var bufferTotatlMem = 0;

      for (var _key in buffers) {
        var b = buffers[_key];
        bufferTotatlMem += b.data.byteLength;
      }

      return {
        count: {
          textures: textures.length,
          buffers: Object.keys(buffers).length,
          renderTextures: rts.length
        },
        mem: {
          // in MBs
          textures: textureTotalMem / (1024 * 1024),
          buffers: bufferTotatlMem / (1024 * 1024)
        }
      };
    }
  }, {
    key: "draw",
    value: function draw() {
      var stats = this.collectStats();
      this.drawCounts(stats.count);
      this.drawMem(stats.mem);
    }
  }, {
    key: "formatNum",
    value: function formatNum(n) {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      return +(n / 1e9).toFixed(1) + "?";
    }
  }, {
    key: "drawCounts",
    value: function drawCounts(counts) {
      var textures = counts.textures,
          buffers = counts.buffers,
          renderTextures = counts.renderTextures;
      var ctx = this.ctx;
      var config = this.config;
      var mainConfig = this.main.config;
      var padding = config.baseCanvasHeight * 0.02;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height * 0.46); // tex buf rtex

      ctx.textAlign = 'left';
      var fontSize = config.baseCanvasWidth * 0.09;
      ctx.font = "".concat(fontSize, "px ").concat(mainConfig.FONT_FAMILY);
      ctx.textBaseline = 'top';
      ctx.fillStyle = mainConfig.COLOR_TEXT_LABEL;
      ctx.fillText('textures buffers render-t', padding * 2, padding);
      fontSize = config.baseCanvasWidth * 0.09;
      ctx.font = "".concat(fontSize, "px ").concat(mainConfig.FONT_FAMILY);
      var avgMinMaxOffsetX = config.baseCanvasWidth * 0.2;
      var avgMinMaxOffsetY = config.baseCanvasWidth * 0.1;
      ctx.textAlign = 'right'; // textures

      var startX = padding + config.baseCanvasWidth * 0.33;
      ctx.fillStyle = mainConfig.COLOR_FPS_BAR;
      ctx.fillText("".concat(this.formatNum(textures)), startX, avgMinMaxOffsetY + padding); // buffers

      ctx.fillStyle = mainConfig.COLOR_FPS_BAR;
      ctx.fillText("".concat(this.formatNum(buffers)), startX + avgMinMaxOffsetX * 1.51, avgMinMaxOffsetY + padding); // render texture

      ctx.fillStyle = mainConfig.COLOR_FPS_BAR;
      ctx.fillText("".concat(this.formatNum(renderTextures)), startX + avgMinMaxOffsetX * 3.2, avgMinMaxOffsetY + padding); //draw calls

      ctx.textAlign = 'left';
      ctx.fillStyle = mainConfig.COLOR_TEXT_LABEL;
      ctx.fillText('drawcalls', padding * 2, config.baseCanvasWidth * 0.21);
      ctx.textAlign = 'right';
      ctx.fillStyle = mainConfig.COLOR_FPS_BAR;
      ctx.fillText("".concat(this.formatNum(this.drawCalls)), startX + padding * 4, config.baseCanvasWidth * 0.3);
    }
  }, {
    key: "drawMem",
    value: function drawMem(mem) {
      var textures = mem.textures,
          buffers = mem.buffers;
      var config = this.config;
      var mainConfig = this.main.config; // shift everything to the left:

      var ctx = this.ctx;
      var imageData = ctx.getImageData(1, 0, ctx.canvas.width - this.memGraph.barWidth, ctx.canvas.height);
      ctx.putImageData(imageData, 0, 0);
      ctx.clearRect(ctx.canvas.width - this.memGraph.barWidth, 0, this.memGraph.barWidth, ctx.canvas.height);
      this.drawMemGraph(textures, config.COLOR_MEM_TEXTURE);
      this.drawMemGraph(buffers, config.COLOR_MEM_BUFFER, textures);
      ctx.clearRect(0, ctx.canvas.height * 0.87, ctx.canvas.width, ctx.canvas.height * 0.2);
      var padding = config.baseCanvasHeight * 0.01;
      ctx.textAlign = 'left';
      var fontSize = config.baseCanvasWidth * 0.09;
      ctx.textBaseline = 'top';
      ctx.font = "".concat(fontSize, "px ").concat(mainConfig.FONT_FAMILY);
      var avgMinMaxOffsetX = config.baseCanvasWidth * 0.2;
      var avgMinMaxOffsetY = config.baseCanvasHeight * 0.88; // mem-textures

      ctx.fillStyle = config.COLOR_MEM_TEXTURE;
      ctx.fillText('mem-tex', padding, avgMinMaxOffsetY + padding); // mem-buffers

      ctx.fillStyle = config.COLOR_MEM_BUFFER;
      ctx.fillText('mem-buf', avgMinMaxOffsetX * 2.2 - padding * 2, avgMinMaxOffsetY + padding);
      this.graphYOffset = 0;
    }
  }, {
    key: "drawMemGraph",
    value: function drawMemGraph(value, color, prevValue) {
      var config = this.config;
      var mainConfig = this.main.config;
      var ctx = this.ctx;
      if (prevValue && value + prevValue > config.maxMemorySize) value = Math.max(0, config.maxMemorySize - prevValue);
      var yOffset = 0;
      if (this.graphYOffset) yOffset += this.graphYOffset;
      var x = mainConfig.maximumHistory * this.memGraph.barWidth - this.memGraph.barWidth;
      var y = this.memGraph.drawY;
      var w = this.memGraph.barWidth;
      var h = Math.min(1, value / config.maxMemorySize) * this.memGraph.height;
      y += this.memGraph.height - h - yOffset;
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1.0;
      ctx.fillRect(x, y, w, w);
      this.graphYOffset = (this.graphYOffset || 0) + h;
    }
  }, {
    key: "hijackGL",
    value: function hijackGL() {
      this.realGLDrawElements = this.app.renderer.gl.drawElements;
      this.app.renderer.gl.drawElements = this.fakeGLdrawElements.bind(this);
      this.hijackedGL = true;
    }
  }, {
    key: "fakeGLdrawElements",
    value: function fakeGLdrawElements(mode, count, type, offset) {
      this.tempDrawCalls++;
      this.realGLDrawElements.call(this.app.renderer.gl, mode, count, type, offset);
    }
  }, {
    key: "restoreGL",
    value: function restoreGL() {
      this.app.renderer.gl.drawElements = this.realGLDrawElements;
      this.hijackedGL = false;
    }
  }, {
    key: "update",
    value: function update() {
      if (this.main.shown && this.pixi && this.app) {
        if (!this.hijackedGL) {
          this.hijackGL();
        }

        this.draw(); // don't draw if we are not shown
      } else if (this.hijackedGL) {
        this.restoreGL();
      }
    }
  }, {
    key: "endFrame",
    value: function endFrame() {
      this.drawCalls = this.tempDrawCalls;
      this.tempDrawCalls = 0;
    }
  }]);

  return PixiStats;
}();

export default PixiStats;
