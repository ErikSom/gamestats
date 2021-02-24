(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GameStats = factory());
}(this, (function () { 'use strict';

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

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var GameStats = /*#__PURE__*/function () {
    function GameStats() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, GameStats);

      var defaultConfig = {
        autoPlace: true,
        targetFPS: 60,
        redrawInterval: 50,
        maximumHistory: 100,
        scale: 1.0,
        memoryUpdateInterval: 1000,
        memoryMaxHistory: 60 * 10,
        // 10 minutes of memory measurements
        // COLORS
        FONT_FAMILY: 'Arial',
        COLOR_FPS_BAR: '#34cfa2',
        COLOR_FPS_AVG: '#FFF',
        COLOR_TEXT_LABEL: '#FFF',
        COLOR_TEXT_TO_LOW: '#eee207',
        COLOR_TEXT_BAD: '#d34646',
        COLOR_TEXT_TARGET: '#d249dd',
        COLOR_BG: '#333333'
      };
      this.config = Object.assign(defaultConfig, options);
      this.dom;
      this.canvas;
      this.ctx;
      this.currentTime;
      this.prevTime;
      this.shown = true;
      this.lastMSAverage;
      this.lastMemoryMeasure = -Number.POSITIVE_INFINITY;
      this.labels = {};
      this.labelColors = {
        'ms': this.config.COLOR_FPS_BAR,
        'memory': this.config.COLOR_FPS_BAR
      };
      this.labelOrder = [];
      this.graphYOffset = 0;
      this.config.baseCanvasWidth = 100 * this.config.scale;
      this.config.baseCanvasHeight = 150 * this.config.scale;
      this.msGraph = {
        width: this.config.baseCanvasWidth,
        height: this.config.baseCanvasHeight * 0.4,
        drawY: this.config.baseCanvasHeight * 0.16,
        barWidth: this.config.baseCanvasWidth / this.config.maximumHistory
      };
      this.memoryGraph = {
        width: this.config.baseCanvasWidth,
        height: this.config.baseCanvasHeight * 0.2,
        drawY: this.config.baseCanvasHeight * 0.76,
        barWidth: this.config.baseCanvasWidth / this.config.memoryMaxHistory
      };
      this.init();
    }

    _createClass(GameStats, [{
      key: "init",
      value: function init() {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('data', 'gamestats');
        this.canvas.width = this.config.baseCanvasWidth;
        this.canvas.height = this.config.baseCanvasHeight;
        this.canvas.style.cssText = "position:fixed;left:0;top:0;width:".concat(this.config.baseCanvasWidth * this.config.scale, "px;height:").concat(this.config.baseCanvasHeight * this.config.scale, "px;background-color:").concat(this.config.COLOR_BG);

        if (this.config.autoPlace) {
          document.body.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');
        this.dom = this.canvas;

        if (performance && performance.memory) {
          this.labels['memory'] = [];
        }

        this.update = this.update.bind(this);
        this.update();
      }
    }, {
      key: "begin",
      value: function begin(label, color) {
        if (['ms', 'fps', 'memory'].includes(label)) throw "jsgraphy: label ".concat(label, " is reserved");
        if (!label) label = 'ms';
        if (label === 'ms' && this.currentTime) this.prevTime = this.currentTime;

        if (label !== 'ms' && !this.labelColors[label]) {
          // register new label
          this.labelColors[label] = color || this.stringToColor(label);
          this.labelOrder.push(label);
        }

        if (!this.labels[label]) this.labels[label] = [];
        var labelMeasures = this.labels[label];
        labelMeasures.push(performance.now());
        if (labelMeasures.length > this.config.maximumHistory) labelMeasures.shift();

        if (label === 'ms') {
          this.currentTime = performance.now();

          if (this.prevTime) {
            if (!this.labels['fps']) this.labels['fps'] = [];
            var fpsMeasures = this.labels['fps'];
            fpsMeasures.push(this.currentTime - this.prevTime);
            if (fpsMeasures.length > this.config.maximumHistory) fpsMeasures.shift();
          }
        }
      }
    }, {
      key: "show",
      value: function show(visible) {
        this.shown = visible;
        this.dom.style.display = visible ? 'block' : 'none';
      }
    }, {
      key: "end",
      value: function end() {
        var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ms';
        var labelMeasures = this.labels[label];

        if (labelMeasures) {
          var beginTime = labelMeasures[labelMeasures.length - 1];
          labelMeasures[labelMeasures.length - 1] = performance.now() - beginTime;
        }
      }
    }, {
      key: "update",
      value: function update() {
        if (this.shown) this.draw(); // don't draw if we are not shown

        if (performance && performance.memory && performance.now() - this.lastMemoryMeasure > this.config.memoryUpdateInterval) {
          var memoryMeasures = this.labels['memory'];
          memoryMeasures.push(performance.memory.usedJSHeapSize / TOMB);
          if (memoryMeasures.length > this.config.memoryMaxHistory) memoryMeasures.shift();
          this.lastMemoryMeasure = performance.now();
        }

        if (this.canvas && this.canvas.parentNode) {
          setTimeout(this.update, this.config.redrawInterval);
        }
      }
    }, {
      key: "draw",
      value: function draw() {
        if (!this.prevTime) return; // shift everything to the left:

        var ctx = this.ctx;
        var imageData = ctx.getImageData(1, 0, ctx.canvas.width - this.msGraph.barWidth, ctx.canvas.height);
        ctx.putImageData(imageData, 0, 0);
        ctx.clearRect(ctx.canvas.width - this.msGraph.barWidth, 0, this.msGraph.barWidth, ctx.canvas.height); // clear fps text

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height * 0.16); // clear memory if needed

        if (performance.memory) ctx.clearRect(0, ctx.canvas.height * 0.6, ctx.canvas.width, ctx.canvas.height * 0.16);
        this.drawGraph('ms', 1000 / this.config.targetFPS);
        this.drawFPS();
        this.graphYOffset = 0;

        var _iterator = _createForOfIteratorHelper(this.labelOrder),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var label = _step.value;
            this.drawGraph(label, this.previousMaxMS, true);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this.drawLines();

        if (performance && performance.memory) {
          this.drawMemory();
        }
      }
    }, {
      key: "drawLines",
      value: function drawLines() {
        var config = this.config;
        var ctx = this.ctx;
        var targetFPS = 1000 / config.targetFPS;
        var average = this.previousAverageMS;
        var max = this.previousMaxMS;
        ctx.fillStyle = config.COLOR_FPS_AVG;
        if (average > targetFPS * 1.66) ctx.fillStyle = config.COLOR_TEXT_BAD;else if (average > targetFPS * 1.33) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
        var averageH = average / max * this.msGraph.height;
        var averageY = this.msGraph.drawY + this.msGraph.height - averageH;
        ctx.fillRect(this.msGraph.width - this.msGraph.barWidth, averageY, this.msGraph.barWidth, this.msGraph.barWidth);
        ctx.fillStyle = config.COLOR_TEXT_TARGET;
        var targetH = targetFPS / max * this.msGraph.height;
        var targetY = this.msGraph.drawY + this.msGraph.height - targetH;
        ctx.fillRect(this.msGraph.width - this.msGraph.barWidth, targetY, this.msGraph.barWidth, this.msGraph.barWidth);
      }
    }, {
      key: "drawGraph",
      value: function drawGraph(label, minMaxValue, doYOffsets) {
        var labelMeasures = this.labels[label];

        var _this$getMMA = this.getMMA(labelMeasures),
            max = _this$getMMA.max,
            average = _this$getMMA.average;

        max = Math.max(average * 1.5, max);
        if (minMaxValue) max = Math.max(minMaxValue, max);
        var config = this.config;
        var ctx = this.ctx;
        var lastIndex = labelMeasures.length - 1;
        var measure = labelMeasures[lastIndex];
        var yOffset = 0;
        if (doYOffsets && this.graphYOffset) yOffset += this.graphYOffset;
        var x = config.maximumHistory * this.msGraph.barWidth - this.msGraph.barWidth;
        var y = this.msGraph.drawY;
        var w = this.msGraph.barWidth;
        var h = measure / max * this.msGraph.height;
        y += this.msGraph.height - h - yOffset;
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = this.labelColors[label];
        ctx.fillRect(x, y, w, h);
        ctx.globalAlpha = 1.0;
        ctx.fillRect(x, y, w, w);

        if (doYOffsets) {
          this.graphYOffset = (this.graphYOffset || 0) + h;
        }

        if (label === 'ms') {
          this.previousAverageMS = average;
          this.previousMaxMS = max;
        }
      }
    }, {
      key: "drawFPS",
      value: function drawFPS() {
        var ctx = this.ctx;
        var config = this.config;
        var fpsMeasures = this.labels['fps'];
        if (!fpsMeasures) return;

        var _this$getMMA2 = this.getMMA(fpsMeasures),
            min = _this$getMMA2.min,
            max = _this$getMMA2.max,
            average = _this$getMMA2.average;

        var averageFPS = Math.round(1000 / average);
        var maxFPS = Math.round(1000 / min);
        var minFPS = Math.round(1000 / max);
        var msMeasures = this.labels['ms'];
        var ms = msMeasures[msMeasures.length - 1].toFixed(1);
        var FPS = Math.round(1000 / fpsMeasures[fpsMeasures.length - 1]); // magic numbers :)

        var padding = config.baseCanvasHeight * 0.01; // avg min max

        ctx.textAlign = 'left';
        var fontSize = config.baseCanvasWidth * 0.09;
        ctx.font = "".concat(fontSize, "px ").concat(config.FONT_FAMILY);
        ctx.textBaseline = 'top';
        ctx.fillStyle = config.COLOR_TEXT_LABEL;
        ctx.fillText('avg min max', padding, padding); //fps

        fontSize = config.baseCanvasWidth * 0.12;
        if (FPS < config.targetFPS * 0.33) ctx.fillStyle = config.COLOR_TEXT_BAD;else if (FPS < config.targetFPS * 0.66) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
        ctx.font = "".concat(fontSize, "px ").concat(config.FONT_FAMILY);
        ctx.textAlign = 'right';
        ctx.fillText("".concat(FPS, " fps"), config.baseCanvasWidth - padding, padding); //ms

        fontSize = config.baseCanvasWidth * 0.1;
        ctx.font = "".concat(fontSize, "px ").concat(config.FONT_FAMILY);
        var msYOffset = config.baseCanvasWidth * 0.12;
        ctx.fillText("".concat(ms, "ms"), config.baseCanvasWidth - padding, msYOffset + padding); //avg min max

        fontSize = config.baseCanvasWidth * 0.09;
        ctx.font = "".concat(fontSize, "px ").concat(config.FONT_FAMILY);
        var avgMinMaxOffsetX = config.baseCanvasWidth * 0.175;
        var avgMinMaxOffsetY = config.baseCanvasWidth * 0.1;
        var badFPS = config.targetFPS * 0.33;
        var toLowFPS = config.targetFPS * 0.66;
        ctx.fillStyle = config.COLOR_FPS_BAR;
        if (averageFPS < badFPS) ctx.fillStyle = config.COLOR_TEXT_BAD;else if (averageFPS < toLowFPS) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
        ctx.fillText("".concat(averageFPS), avgMinMaxOffsetX - padding, avgMinMaxOffsetY + padding);
        ctx.fillStyle = config.COLOR_FPS_BAR;
        if (minFPS < badFPS) ctx.fillStyle = config.COLOR_TEXT_BAD;else if (minFPS < toLowFPS) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
        ctx.fillText("".concat(minFPS), avgMinMaxOffsetX * 2.1 - padding * 2, avgMinMaxOffsetY + padding);
        ctx.fillStyle = config.COLOR_FPS_BAR;
        if (maxFPS < badFPS) ctx.fillStyle = config.COLOR_TEXT_BAD;else if (maxFPS < toLowFPS) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
        ctx.fillText("".concat(maxFPS), avgMinMaxOffsetX * 3.3 - padding * 3, avgMinMaxOffsetY + padding);
      }
    }, {
      key: "drawMemory",
      value: function drawMemory() {
        var config = this.config;
        var ctx = this.ctx;
        var padding = config.baseCanvasHeight * 0.01;
        var memoryTextY = config.baseCanvasHeight * 0.60; // avg min max

        ctx.textAlign = 'left';
        var fontSize = config.baseCanvasWidth * 0.09;
        ctx.font = "".concat(fontSize, "px ").concat(config.FONT_FAMILY);
        ctx.textBaseline = 'top';
        ctx.fillStyle = config.COLOR_TEXT_LABEL;
        ctx.fillText('reserved', padding, memoryTextY + padding);
        ctx.fillStyle = config.COLOR_TEXT_TARGET;
        ctx.textAlign = 'right';
        var reservedMemory = (performance.memory.jsHeapSizeLimit / TOMB).toFixed(1);
        ctx.fillText("".concat(reservedMemory, "MB"), config.baseCanvasWidth - padding, memoryTextY + padding);
        ctx.textAlign = 'left';
        ctx.fillStyle = config.COLOR_TEXT_LABEL;
        ctx.fillText('allocated', padding, memoryTextY * 1.12 + padding);
        ctx.textAlign = 'right';
        var allocatedMemory = (performance.memory.usedJSHeapSize / TOMB).toFixed(1);
        ctx.fillStyle = config.COLOR_FPS_BAR;

        if (allocatedMemory > reservedMemory * .9) {
          ctx.fillStyle = config.COLOR_TEXT_BAD;
        } else if (allocatedMemory > reservedMemory * .66) {
          ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
        }

        ctx.fillText("".concat(allocatedMemory, "MB"), config.baseCanvasWidth - padding, memoryTextY * 1.12 + padding);
        var targetMemory = performance.memory.jsHeapSizeLimit / TOMB;
        var memoryMeasures = this.labels['memory'];
        var lastValue = memoryMeasures[memoryMeasures.length - 1];
        var x = this.memoryGraph.width - this.memoryGraph.barWidth * 6;
        var y = this.memoryGraph.drawY;
        var w = this.memoryGraph.barWidth * 6;
        var h = lastValue / targetMemory * this.memoryGraph.height;
        y += this.memoryGraph.height - h;
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = this.labelColors['memory'];
        ctx.fillRect(x, y, w, h);
        ctx.globalAlpha = 1.0;
        ctx.fillRect(x, y, w, w);

        var _this$getMMA3 = this.getMMA(this.labels['memory']),
            average = _this$getMMA3.average;

        ctx.fillStyle = config.COLOR_FPS_AVG;
        if (average > targetMemory * 0.9) ctx.fillStyle = config.COLOR_TEXT_BAD;else if (average > targetMemory * 0.66) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
        var averageH = average / targetMemory * this.memoryGraph.height;
        var averageY = this.memoryGraph.drawY + this.memoryGraph.height - averageH;
        ctx.fillRect(this.memoryGraph.width - this.memoryGraph.barWidth * 6, averageY, this.memoryGraph.barWidth * 6, this.memoryGraph.barWidth * 6);
        ctx.fillStyle = config.COLOR_TEXT_TARGET;
        var targetH = this.memoryGraph.height;
        var targetY = this.memoryGraph.drawY + this.memoryGraph.height - targetH;
        ctx.fillRect(this.memoryGraph.width - this.memoryGraph.barWidth * 6, targetY, this.memoryGraph.barWidth * 6, this.memoryGraph.barWidth * 6);
      }
    }, {
      key: "getMMA",
      value: function getMMA(measures) {
        var min = Number.POSITIVE_INFINITY;
        var max = -Number.POSITIVE_INFINITY;
        var average = 0;

        var _iterator2 = _createForOfIteratorHelper(measures),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var measure = _step2.value;
            if (measure < min) min = measure;
            if (measure > max) max = measure;
            average += measure;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        average /= measures.length;
        return {
          min: min,
          max: max,
          average: average
        };
      }
    }, {
      key: "stringToColor",
      value: function stringToColor(str) {
        var hash = 0;

        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        var c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return "#".concat("00000".substring(0, 6 - c.length)).concat(c);
      }
    }]);

    return GameStats;
  }();
  var TOMB = 1048576;

  return GameStats;

})));
