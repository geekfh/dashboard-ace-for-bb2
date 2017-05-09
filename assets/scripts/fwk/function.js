/**|--------------------------------------------
 * |@Function
 * |--------------------------------------------*/
define([], function() {


    FuncObj = {
        /**
         * Create a new function from the provided `fn`, change `this` to the provided scope, optionally
         * overrides arguments for the call. (Defaults to the arguments passed by the caller)
         *
         * {@link Ext#bind Opf.bind} is alias for {@link FuncObj#bind FuncObj.bind}
         *
         * @param {Function} fn The function to delegate.
         * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
         * **If omitted, defaults to the default global environment object (usually the browser window).**
         * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
         * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
         * if a number the args are inserted at the specified position
         * @return {Function} The new function
         */
        bind: function(fn, scope, args, appendArgs) {
            if (arguments.length === 2) {
                return function() {
                    return fn.apply(scope, arguments);
                };
            }

            var method = fn,
                slice = Array.prototype.slice;

            return function() {
                var callArgs = args || arguments;

                if (appendArgs === true) {
                    callArgs = slice.call(arguments, 0);
                    callArgs = callArgs.concat(args);
                } else if (typeof appendArgs == 'number') {
                    callArgs = slice.call(arguments, 0); // copy arguments first
                    Opf.Array.insert(callArgs, appendArgs, args);
                }

                return method.apply(scope || Opf.global, callArgs);
            };
        },

        /**
         * Calls this function after the number of millseconds specified, optionally in a specific scope. Example usage:
         *
         *     var sayHi = function(name){
         *         alert('Hi, ' + name);
         *     }
         *
         *     // executes immediately:
         *     sayHi('Fred');
         *
         *     // executes after 2 seconds:
         *     FuncObj.defer(sayHi, 2000, this, ['Fred']);
         *
         *     // this syntax is sometimes useful for deferring
         *     // execution of an anonymous function:
         *     FuncObj.defer(function(){
         *         alert('Anonymous');
         *     }, 100);
         *
         * {@link Ext#defer Opf.defer} is alias for {@link FuncObj#defer FuncObj.defer}
         *
         * @param {Function} fn The function to defer.
         * @param {Number} millis The number of milliseconds for the setTimeout call
         * (if less than or equal to 0 the function is executed immediately)
         * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
         * **If omitted, defaults to the browser window.**
         * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
         * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
         * if a number the args are inserted at the specified position
         * @return {Number} The timeout id that can be used with clearTimeout
         */
        defer: function(fn, millis, scope, args, appendArgs) {
            fn = FuncObj.bind(fn, scope, args, appendArgs);
            if (millis > 0) {
                return setTimeout(Opf.supports.TimeoutActualLateness ? function() {
                    fn();
                } : fn, millis);
            }
            fn();
            return 0;
        },

        /**
         * Creates an interceptor function. The passed function is called before the original one. If it returns false,
         * the original one is not called. The resulting function returns the results of the original function.
         * The passed function is called with the parameters of the original function. Example usage:
         *
         *     var sayHi = function(name){
         *         alert('Hi, ' + name);
         *     }
         *
         *     sayHi('Fred'); // alerts "Hi, Fred"
         *
         *     // create a new function that validates input without
         *     // directly modifying the original function:
         *     var sayHiToFriend = FuncObj.createInterceptor(sayHi, function(name){
         *         return name == 'Brian';
         *     });
         *
         *     sayHiToFriend('Fred');  // no alert
         *     sayHiToFriend('Brian'); // alerts "Hi, Brian"
         *
         * @param {Function} origFn The original function.
         * @param {Function} newFn The function to call before the original
         * @param {Object} [scope] The scope (`this` reference) in which the passed function is executed.
         * **If omitted, defaults to the scope in which the original function is called or the browser window.**
         * @param {Object} [returnValue=null] The value to return if the passed function return false.
         * @return {Function} The new function
         */
        createInterceptor: function(origFn, newFn, scope, returnValue) {
            var method = origFn;
            if (!$.isFunction(newFn)) {
                return origFn;
            } else {
                //provie isDefined
                returnValue = returnValue !== void 0 ? returnValue : null;
                return function() {
                    var me = this,
                        args = arguments;

                    newFn.target = me;
                    newFn.method = origFn;
                    return (newFn.apply(scope || me, args) !== false) ? origFn.apply(me || Opf.global, args) : returnValue;
                };
            }
        },

        /**
         * Create a combined function call sequence of the original function + the passed function.
         * The resulting function returns the results of the original function.
         * The passed function is called with the parameters of the original function. Example usage:
         *
         *     var sayHi = function(name){
         *         alert('Hi, ' + name);
         *     }
         *
         *     sayHi('Fred'); // alerts "Hi, Fred"
         *
         *     var sayGoodbye = FuncObj.createSequence(sayHi, function(name){
         *         alert('Bye, ' + name);
         *     });
         *
         *     sayGoodbye('Fred'); // both alerts show
         *
         * @param {Function} originalFn The original function.
         * @param {Function} newFn The function to sequence
         * @param {Object} scope (optional) The scope (`this` reference) in which the passed function is executed.
         * If omitted, defaults to the scope in which the original function is called or the default global environment object (usually the browser window).
         * @return {Function} The new function
         */
        createSequence: function(originalFn, newFn, scope) {
            if (!newFn) {
                return originalFn;
            } else {
                return function() {
                    var result = originalFn.apply(this, arguments);
                    newFn.apply(scope || this, arguments);
                    return result;
                };
            }
        },

        /**
         * Creates a delegate function, optionally with a bound scope which, when called, buffers
         * the execution of the passed function for the configured number of milliseconds.
         * If called again within that period, the impending invocation will be canceled, and the
         * timeout period will begin again.
         *
         * @param {Function} fn The function to invoke on a buffered timer.
         * @param {Number} buffer The number of milliseconds by which to buffer the invocation of the
         * function.
         * @param {Object} scope (optional) The scope (`this` reference) in which
         * the passed function is executed. If omitted, defaults to the scope specified by the caller.
         * @param {Array} args (optional) Override arguments for the call. Defaults to the arguments
         * passed by the caller.
         * @return {Function} A function which invokes the passed function after buffering for the specified time.
         */
        createBuffered: function(fn, buffer, scope, args) {
            var timerId;

            return function() {
                var callArgs = args || Array.prototype.slice.call(arguments, 0),
                    me = scope || this;

                if (timerId) {
                    clearTimeout(timerId);
                }

                timerId = setTimeout(function() {
                    fn.apply(me, callArgs);
                }, buffer);
            };
        },

        /**
         * Creates a throttled version of the passed function which, when called repeatedly and
         * rapidly, invokes the passed function only after a certain interval has elapsed since the
         * previous invocation.
         *
         * This is useful for wrapping functions which may be called repeatedly, such as
         * a handler of a mouse move event when the processing is expensive.
         *
         * @param {Function} fn The function to execute at a regular time interval.
         * @param {Number} interval The interval **in milliseconds** on which the passed function is executed.
         * @param {Object} scope (optional) The scope (`this` reference) in which
         * the passed function is executed. If omitted, defaults to the scope specified by the caller.
         * @returns {Function} A function which invokes the passed function at the specified interval.
         */
        createThrottled: function(fn, interval, scope) {
            var lastCallTime, elapsed, lastArgs, timer, execute = function() {
                    fn.apply(scope || this, lastArgs);
                    lastCallTime = new Date();
                };

            return function() {
                elapsed = new Date() - lastCallTime;
                lastArgs = arguments;

                clearTimeout(timer);
                if (!lastCallTime || (elapsed >= interval)) {
                    execute();
                } else {
                    timer = setTimeout(execute, interval - elapsed);
                }
            };
        }

    };
    return FuncObj;
});