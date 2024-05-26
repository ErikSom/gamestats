(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GameStats = factory());
}(this, (function () { 'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

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

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var runtime_1 = createCommonjsModule(function (module) {
    /**
     * Copyright (c) 2014-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var runtime = function (exports) {

      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined$1; // More compressible than void 0.

      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }

      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, "");
      } catch (err) {
        define = function (obj, key, value) {
          return obj[key] = value;
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.

        generator._invoke = makeInvokeMethod(innerFn, self, context);
        return generator;
      }

      exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.

      function tryCatch(fn, obj, arg) {
        try {
          return {
            type: "normal",
            arg: fn.call(obj, arg)
          };
        } catch (err) {
          return {
            type: "throw",
            arg: err
          };
        }
      }

      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.

      var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.

      function Generator() {}

      function GeneratorFunction() {}

      function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.


      var IteratorPrototype = {};

      IteratorPrototype[iteratorSymbol] = function () {
        return this;
      };

      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

      if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
      GeneratorFunctionPrototype.constructor = GeneratorFunction;
      GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.

      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function (method) {
          define(prototype, method, function (arg) {
            return this._invoke(method, arg);
          });
        });
      }

      exports.isGeneratorFunction = function (genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
      };

      exports.mark = function (genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }

        genFun.prototype = Object.create(Gp);
        return genFun;
      }; // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.


      exports.awrap = function (arg) {
        return {
          __await: arg
        };
      };

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);

          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;

            if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function (value) {
                invoke("next", value, resolve, reject);
              }, function (err) {
                invoke("throw", err, resolve, reject);
              });
            }

            return PromiseImpl.resolve(value).then(function (unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped;
              resolve(result);
            }, function (error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke("throw", error, resolve, reject);
            });
          }
        }

        var previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }

          return previousPromise = // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        } // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).


        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);

      AsyncIterator.prototype[asyncIteratorSymbol] = function () {
        return this;
      };

      exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.

      exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;
        var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
        return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function (result) {
          return result.done ? result.value : iter.next();
        });
      };

      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;
        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }

          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            } // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            var delegate = context.delegate;

            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);

              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === "next") {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;
            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);
            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }

            state = GenStateExecuting;
            var record = tryCatch(innerFn, self, context);

            if (record.type === "normal") {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done ? GenStateCompleted : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done
              };
            } else if (record.type === "throw") {
              state = GenStateCompleted; // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.

              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      } // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.


      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];

        if (method === undefined$1) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === "throw") {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator["return"]) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = "return";
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);

              if (context.method === "throw") {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = "throw";
            context.arg = new TypeError("The iterator does not provide a 'throw' method");
          }

          return ContinueSentinel;
        }

        var record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        var info = record.arg;

        if (!info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

          context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.

          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }
        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        } // The delegate iterator is finished, so forget it and continue with
        // the outer generator.


        context.delegate = null;
        return ContinueSentinel;
      } // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.


      defineIteratorMethods(Gp);
      define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.

      Gp[iteratorSymbol] = function () {
        return this;
      };

      Gp.toString = function () {
        return "[object Generator]";
      };

      function pushTryEntry(locs) {
        var entry = {
          tryLoc: locs[0]
        };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [{
          tryLoc: "root"
        }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      exports.keys = function (object) {
        var keys = [];

        for (var key in object) {
          keys.push(key);
        }

        keys.reverse(); // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.

        return function next() {
          while (keys.length) {
            var key = keys.pop();

            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          } // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.


          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];

          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === "function") {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            var i = -1,
                next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }

              next.value = undefined$1;
              next.done = true;
              return next;
            };

            return next.next = next;
          }
        } // Return an iterator with no values.


        return {
          next: doneResult
        };
      }

      exports.values = values;

      function doneResult() {
        return {
          value: undefined$1,
          done: true
        };
      }

      Context.prototype = {
        constructor: Context,
        reset: function (skipTempReset) {
          this.prev = 0;
          this.next = 0; // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.

          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;
          this.method = "next";
          this.arg = undefined$1;
          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (var name in this) {
              // Not sure about the optimal order of these conditions:
              if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                this[name] = undefined$1;
              }
            }
          }
        },
        stop: function () {
          this.done = true;
          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;

          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }

          return this.rval;
        },
        dispatchException: function (exception) {
          if (this.done) {
            throw exception;
          }

          var context = this;

          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = "next";
              context.arg = undefined$1;
            }

            return !!caught;
          }

          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === "root") {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle("end");
            }

            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },
        abrupt: function (type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }

          if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },
        complete: function (record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }

          if (record.type === "break" || record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },
        finish: function (finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        "catch": function (tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;

              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }

              return thrown;
            }
          } // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.


          throw new Error("illegal catch attempt");
        },
        delegateYield: function (iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };

          if (this.method === "next") {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined$1;
          }

          return ContinueSentinel;
        }
      }; // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.

      return exports;
    }( // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports );

    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  });

  var regenerator = runtime_1;

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
      this.extensions = {};
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
        this.canvas.width = this.config.baseCanvasWidth;
        this.canvas.height = this.config.baseCanvasHeight;
        this.canvas.style.cssText = "width:".concat(this.config.baseCanvasWidth, "px;height:").concat(this.config.baseCanvasHeight, "px;background-color:").concat(this.config.COLOR_BG);
        this.ctx = this.canvas.getContext('2d');
        this.dom = document.createElement('div');
        this.dom.appendChild(this.canvas);
        this.dom.setAttribute('data', 'gamestats');
        this.dom.style.cssText = "position:fixed;left:0;top:0;display: flex;flex-direction: column;gap: 5px;";

        if (this.config.autoPlace) {
          document.body.appendChild(this.dom);
        }

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
        this.dom.style.display = visible ? 'flex' : 'none';
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

        if (label === 'ms') {
          for (var key in this.extensions) {
            this.extensions[key].endFrame();
          }
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

        for (var key in this.extensions) {
          this.extensions[key].update();
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
    }, {
      key: "enableExtension",
      value: function () {
        var _enableExtension = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(name, params) {
          var module, extension;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!this.extensions[name]) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt("return", null);

                case 2:
                  _context.prev = 2;
                  _context.next = 5;
                  return import("./gamestats-".concat(name, ".module.js"));

                case 5:
                  module = _context.sent;
                  extension = _construct(module["default"], [this].concat(_toConsumableArray(params)));
                  this.extensions[name] = extension;
                  _context.next = 14;
                  break;

                case 10:
                  _context.prev = 10;
                  _context.t0 = _context["catch"](2);
                  console.log(_context.t0);
                  return _context.abrupt("return", null);

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[2, 10]]);
        }));

        function enableExtension(_x, _x2) {
          return _enableExtension.apply(this, arguments);
        }

        return enableExtension;
      }()
    }]);

    return GameStats;
  }();
  var TOMB = 1048576;

  return GameStats;

})));
