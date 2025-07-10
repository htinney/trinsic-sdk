import React, { createContext, useReducer, useCallback, useContext } from 'react';
import { launchRedirect, launchIframe, launchPopup } from '@trinsic/web-ui';

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var reactJsxRuntime_development = {};

/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_development;

function requireReactJsxRuntime_development () {
	if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
	hasRequiredReactJsxRuntime_development = 1;
	"production" !== process.env.NODE_ENV &&
	  (function () {
	    function getComponentNameFromType(type) {
	      if (null == type) return null;
	      if ("function" === typeof type)
	        return type.$$typeof === REACT_CLIENT_REFERENCE
	          ? null
	          : type.displayName || type.name || null;
	      if ("string" === typeof type) return type;
	      switch (type) {
	        case REACT_FRAGMENT_TYPE:
	          return "Fragment";
	        case REACT_PROFILER_TYPE:
	          return "Profiler";
	        case REACT_STRICT_MODE_TYPE:
	          return "StrictMode";
	        case REACT_SUSPENSE_TYPE:
	          return "Suspense";
	        case REACT_SUSPENSE_LIST_TYPE:
	          return "SuspenseList";
	        case REACT_ACTIVITY_TYPE:
	          return "Activity";
	      }
	      if ("object" === typeof type)
	        switch (
	          ("number" === typeof type.tag &&
	            console.error(
	              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
	            ),
	          type.$$typeof)
	        ) {
	          case REACT_PORTAL_TYPE:
	            return "Portal";
	          case REACT_CONTEXT_TYPE:
	            return (type.displayName || "Context") + ".Provider";
	          case REACT_CONSUMER_TYPE:
	            return (type._context.displayName || "Context") + ".Consumer";
	          case REACT_FORWARD_REF_TYPE:
	            var innerType = type.render;
	            type = type.displayName;
	            type ||
	              ((type = innerType.displayName || innerType.name || ""),
	              (type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef"));
	            return type;
	          case REACT_MEMO_TYPE:
	            return (
	              (innerType = type.displayName || null),
	              null !== innerType
	                ? innerType
	                : getComponentNameFromType(type.type) || "Memo"
	            );
	          case REACT_LAZY_TYPE:
	            innerType = type._payload;
	            type = type._init;
	            try {
	              return getComponentNameFromType(type(innerType));
	            } catch (x) {}
	        }
	      return null;
	    }
	    function testStringCoercion(value) {
	      return "" + value;
	    }
	    function checkKeyStringCoercion(value) {
	      try {
	        testStringCoercion(value);
	        var JSCompiler_inline_result = !1;
	      } catch (e) {
	        JSCompiler_inline_result = true;
	      }
	      if (JSCompiler_inline_result) {
	        JSCompiler_inline_result = console;
	        var JSCompiler_temp_const = JSCompiler_inline_result.error;
	        var JSCompiler_inline_result$jscomp$0 =
	          ("function" === typeof Symbol &&
	            Symbol.toStringTag &&
	            value[Symbol.toStringTag]) ||
	          value.constructor.name ||
	          "Object";
	        JSCompiler_temp_const.call(
	          JSCompiler_inline_result,
	          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
	          JSCompiler_inline_result$jscomp$0
	        );
	        return testStringCoercion(value);
	      }
	    }
	    function getTaskName(type) {
	      if (type === REACT_FRAGMENT_TYPE) return "<>";
	      if (
	        "object" === typeof type &&
	        null !== type &&
	        type.$$typeof === REACT_LAZY_TYPE
	      )
	        return "<...>";
	      try {
	        var name = getComponentNameFromType(type);
	        return name ? "<" + name + ">" : "<...>";
	      } catch (x) {
	        return "<...>";
	      }
	    }
	    function getOwner() {
	      var dispatcher = ReactSharedInternals.A;
	      return null === dispatcher ? null : dispatcher.getOwner();
	    }
	    function UnknownOwner() {
	      return Error("react-stack-top-frame");
	    }
	    function hasValidKey(config) {
	      if (hasOwnProperty.call(config, "key")) {
	        var getter = Object.getOwnPropertyDescriptor(config, "key").get;
	        if (getter && getter.isReactWarning) return false;
	      }
	      return void 0 !== config.key;
	    }
	    function defineKeyPropWarningGetter(props, displayName) {
	      function warnAboutAccessingKey() {
	        specialPropKeyWarningShown ||
	          ((specialPropKeyWarningShown = true),
	          console.error(
	            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
	            displayName
	          ));
	      }
	      warnAboutAccessingKey.isReactWarning = true;
	      Object.defineProperty(props, "key", {
	        get: warnAboutAccessingKey,
	        configurable: true
	      });
	    }
	    function elementRefGetterWithDeprecationWarning() {
	      var componentName = getComponentNameFromType(this.type);
	      didWarnAboutElementRef[componentName] ||
	        ((didWarnAboutElementRef[componentName] = true),
	        console.error(
	          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
	        ));
	      componentName = this.props.ref;
	      return void 0 !== componentName ? componentName : null;
	    }
	    function ReactElement(
	      type,
	      key,
	      self,
	      source,
	      owner,
	      props,
	      debugStack,
	      debugTask
	    ) {
	      self = props.ref;
	      type = {
	        $$typeof: REACT_ELEMENT_TYPE,
	        type: type,
	        key: key,
	        props: props,
	        _owner: owner
	      };
	      null !== (void 0 !== self ? self : null)
	        ? Object.defineProperty(type, "ref", {
	            enumerable: false,
	            get: elementRefGetterWithDeprecationWarning
	          })
	        : Object.defineProperty(type, "ref", { enumerable: false, value: null });
	      type._store = {};
	      Object.defineProperty(type._store, "validated", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: 0
	      });
	      Object.defineProperty(type, "_debugInfo", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: null
	      });
	      Object.defineProperty(type, "_debugStack", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: debugStack
	      });
	      Object.defineProperty(type, "_debugTask", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: debugTask
	      });
	      Object.freeze && (Object.freeze(type.props), Object.freeze(type));
	      return type;
	    }
	    function jsxDEVImpl(
	      type,
	      config,
	      maybeKey,
	      isStaticChildren,
	      source,
	      self,
	      debugStack,
	      debugTask
	    ) {
	      var children = config.children;
	      if (void 0 !== children)
	        if (isStaticChildren)
	          if (isArrayImpl(children)) {
	            for (
	              isStaticChildren = 0;
	              isStaticChildren < children.length;
	              isStaticChildren++
	            )
	              validateChildKeys(children[isStaticChildren]);
	            Object.freeze && Object.freeze(children);
	          } else
	            console.error(
	              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
	            );
	        else validateChildKeys(children);
	      if (hasOwnProperty.call(config, "key")) {
	        children = getComponentNameFromType(type);
	        var keys = Object.keys(config).filter(function (k) {
	          return "key" !== k;
	        });
	        isStaticChildren =
	          0 < keys.length
	            ? "{key: someKey, " + keys.join(": ..., ") + ": ...}"
	            : "{key: someKey}";
	        didWarnAboutKeySpread[children + isStaticChildren] ||
	          ((keys =
	            0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}"),
	          console.error(
	            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
	            isStaticChildren,
	            children,
	            keys,
	            children
	          ),
	          (didWarnAboutKeySpread[children + isStaticChildren] = true));
	      }
	      children = null;
	      void 0 !== maybeKey &&
	        (checkKeyStringCoercion(maybeKey), (children = "" + maybeKey));
	      hasValidKey(config) &&
	        (checkKeyStringCoercion(config.key), (children = "" + config.key));
	      if ("key" in config) {
	        maybeKey = {};
	        for (var propName in config)
	          "key" !== propName && (maybeKey[propName] = config[propName]);
	      } else maybeKey = config;
	      children &&
	        defineKeyPropWarningGetter(
	          maybeKey,
	          "function" === typeof type
	            ? type.displayName || type.name || "Unknown"
	            : type
	        );
	      return ReactElement(
	        type,
	        children,
	        self,
	        source,
	        getOwner(),
	        maybeKey,
	        debugStack,
	        debugTask
	      );
	    }
	    function validateChildKeys(node) {
	      "object" === typeof node &&
	        null !== node &&
	        node.$$typeof === REACT_ELEMENT_TYPE &&
	        node._store &&
	        (node._store.validated = 1);
	    }
	    var React$1 = React,
	      REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	      REACT_PORTAL_TYPE = Symbol.for("react.portal"),
	      REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
	      REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
	      REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
	      REACT_CONTEXT_TYPE = Symbol.for("react.context"),
	      REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
	      REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
	      REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
	      REACT_MEMO_TYPE = Symbol.for("react.memo"),
	      REACT_LAZY_TYPE = Symbol.for("react.lazy"),
	      REACT_ACTIVITY_TYPE = Symbol.for("react.activity"),
	      REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"),
	      ReactSharedInternals =
	        React$1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
	      hasOwnProperty = Object.prototype.hasOwnProperty,
	      isArrayImpl = Array.isArray,
	      createTask = console.createTask
	        ? console.createTask
	        : function () {
	            return null;
	          };
	    React$1 = {
	      "react-stack-bottom-frame": function (callStackForError) {
	        return callStackForError();
	      }
	    };
	    var specialPropKeyWarningShown;
	    var didWarnAboutElementRef = {};
	    var unknownOwnerDebugStack = React$1["react-stack-bottom-frame"].bind(
	      React$1,
	      UnknownOwner
	    )();
	    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
	    var didWarnAboutKeySpread = {};
	    reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
	    reactJsxRuntime_development.jsx = function (type, config, maybeKey, source, self) {
	      var trackActualOwner =
	        1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
	      return jsxDEVImpl(
	        type,
	        config,
	        maybeKey,
	        false,
	        source,
	        self,
	        trackActualOwner
	          ? Error("react-stack-top-frame")
	          : unknownOwnerDebugStack,
	        trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
	      );
	    };
	    reactJsxRuntime_development.jsxs = function (type, config, maybeKey, source, self) {
	      var trackActualOwner =
	        1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
	      return jsxDEVImpl(
	        type,
	        config,
	        maybeKey,
	        true,
	        source,
	        self,
	        trackActualOwner
	          ? Error("react-stack-top-frame")
	          : unknownOwnerDebugStack,
	        trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
	      );
	    };
	  })();
	return reactJsxRuntime_development;
}

if (process.env.NODE_ENV === 'production') {
  jsxRuntime.exports = requireReactJsxRuntime_production();
} else {
  jsxRuntime.exports = requireReactJsxRuntime_development();
}

var jsxRuntimeExports = jsxRuntime.exports;

// Custom popup launcher with better closure detection
const launchPopupWithClosureDetection = async (getLaunchUrl, loadingDomain, relyingPartyName) => {
    const userAgents = detectUserAgents();
    const popup = window.open(`https://${"api.trinsic.id"}/loading`, "Trinsic", userAgents.isDesktop
        ? "width=600,height=900"
        : "width=" +
            window.innerWidth +
            ",height=" +
            window.innerHeight +
            ",top=0,left=0");
    if (!popup) {
        throw new Error("Failed to open popup window");
    }
    // Safely retrieve a launch url and close the popup on failure.
    let launchUrl = "";
    try {
        launchUrl = await getLaunchUrl();
        if (!launchUrl) {
            throw new Error("Launch URL is empty");
        }
    }
    catch (error) {
        try {
            popup.close();
        }
        catch (error) {
            // Error closing popup - continue with original error
        }
        throw error;
    }
    launchUrl += "&launchMode=popup";
    popup.location.href = launchUrl;
    return new Promise((resolve, reject) => {
        let messageHandler = null;
        let closureChecker = null;
        let isResolved = false;
        const cleanup = () => {
            if (messageHandler) {
                window.removeEventListener("message", messageHandler);
            }
            if (closureChecker) {
                clearInterval(closureChecker);
            }
        };
        const resolveWithCleanup = (result) => {
            if (!isResolved) {
                isResolved = true;
                cleanup();
                resolve(result);
            }
        };
        const rejectWithCleanup = (error) => {
            if (!isResolved) {
                isResolved = true;
                cleanup();
                reject(error);
            }
        };
        // Listen for messages from the popup
        messageHandler = (event) => {
            if (event.data?.success === true) {
                try {
                    popup?.close();
                }
                catch (error) {
                    // Error closing popup - continue
                }
                resolveWithCleanup(event.data);
            }
            if (event.data?.success === false) {
                try {
                    popup?.close();
                }
                catch (error) {
                    // Error closing popup - continue
                }
                rejectWithCleanup(event.data);
            }
        };
        window.addEventListener("message", messageHandler, false);
        // Check for manual popup closure every second
        closureChecker = setInterval(() => {
            if (popup.closed) {
                rejectWithCleanup({
                    success: false,
                    msg: 'user-closed',
                    sessionId: undefined,
                    resultsAccessKey: undefined
                });
            }
        }, 1000);
    });
};
// Helper function to detect user agents (copied from @trinsic/web-ui)
const detectUserAgents = () => {
    const userAgent = navigator.userAgent;
    return {
        isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
    };
};
const initialState = {
    sessionUrl: null,
    redirectUrl: null,
    exchangeUrl: null,
    isLoading: false,
    error: null,
    result: null,
};
function trinsicReducer(state, action) {
    switch (action.type) {
        case 'SET_CONFIG':
            return {
                ...state,
                sessionUrl: action.payload.sessionUrl,
                redirectUrl: action.payload.redirectUrl || null,
                exchangeUrl: action.payload.exchangeUrl || null
            };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_RESULT':
            return { ...state, result: action.payload };
        default:
            return state;
    }
}
const TrinsicContext = createContext(undefined);
const TrinsicProvider = ({ children, sessionUrl, redirectUrl, exchangeUrl }) => {
    const [state, dispatch] = useReducer(trinsicReducer, initialState);
    const setConfig = useCallback((sessionUrl, redirectUrl, exchangeUrl) => {
        dispatch({ type: 'SET_CONFIG', payload: { sessionUrl, redirectUrl, exchangeUrl } });
    }, []);
    // Set initial config from props if provided
    React.useEffect(() => {
        if (sessionUrl) {
            setConfig(sessionUrl, redirectUrl, exchangeUrl);
        }
    }, [sessionUrl, redirectUrl, exchangeUrl, setConfig]);
    const createSession = useCallback(async (withRedirect = false) => {
        if (!state.sessionUrl) {
            throw new Error('Session URL not set. Call useTrinsic with sessionUrl first.');
        }
        let url = state.sessionUrl;
        if (withRedirect && state.redirectUrl) {
            url += `?redirectUrl=${encodeURIComponent(state.redirectUrl)}`;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to create session: ${response.statusText}`);
        }
        const data = await response.json();
        return data.launchUrl;
    }, [state.sessionUrl, state.redirectUrl]);
    const launch = useCallback(async (launchMode) => {
        if (!state.sessionUrl) {
            throw new Error('Session URL not set. Call useTrinsic with sessionUrl first.');
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        dispatch({ type: 'SET_RESULT', payload: null });
        try {
            let verificationResult = null;
            switch (launchMode) {
                case 'popup':
                    verificationResult = await launchPopup(async () => {
                        return await createSession();
                    });
                    break;
                case 'iframe':
                    const launchUrl = await createSession();
                    verificationResult = await launchIframe(launchUrl);
                    break;
                case 'redirect':
                    const redirectLaunchUrl = await createSession(true);
                    await launchRedirect(redirectLaunchUrl);
                    dispatch({ type: 'SET_RESULT', payload: { success: true } }); // Redirect doesn't return a result
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                default:
                    throw new Error(`Invalid launch mode: ${launchMode}`);
            }
            if (verificationResult && verificationResult.success) {
                // Exchange the result if exchangeUrl is provided
                if (state.exchangeUrl) {
                    const exchangeResponse = await fetch(state.exchangeUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(verificationResult),
                    });
                    if (exchangeResponse.ok) {
                        const exchangeData = await exchangeResponse.json();
                        dispatch({ type: 'SET_RESULT', payload: { success: true, data: exchangeData } });
                    }
                    else {
                        dispatch({ type: 'SET_RESULT', payload: { success: false, error: 'Failed to exchange result' } });
                    }
                }
                else {
                    // If no exchangeUrl provided, just return the verification result
                    dispatch({ type: 'SET_RESULT', payload: { success: true, data: verificationResult } });
                }
            }
            else {
                dispatch({ type: 'SET_RESULT', payload: { success: false, error: 'Verification failed' } });
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            dispatch({ type: 'SET_RESULT', payload: { success: false, error: errorMessage } });
        }
        finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [createSession, state.exchangeUrl]);
    const value = {
        ...state,
        launch,
        setConfig,
        dispatch,
    };
    return (jsxRuntimeExports.jsx(TrinsicContext.Provider, { value: value, children: children }));
};
// Base hook that sets config and returns launch function
const useTrinsicBase = (options) => {
    const context = useContext(TrinsicContext);
    if (context === undefined) {
        throw new Error('useTrinsic must be used within a TrinsicProvider');
    }
    // Memoize the launch function with options
    const launchWithOptions = useCallback(async (launchMode) => {
        // Merge options with provider config, allowing options to override provider defaults
        const config = {
            sessionUrl: options?.sessionUrl || context.sessionUrl,
            redirectUrl: options?.redirectUrl || context.redirectUrl,
            exchangeUrl: options?.exchangeUrl || context.exchangeUrl,
        };
        if (!config.sessionUrl) {
            throw new Error('Session URL not set. Either provide sessionUrl in options or configure TrinsicProvider with sessionUrl prop.');
        }
        context.dispatch({ type: 'SET_LOADING', payload: true });
        context.dispatch({ type: 'SET_ERROR', payload: null });
        context.dispatch({ type: 'SET_RESULT', payload: null });
        try {
            let verificationResult = null;
            const createSessionWithOptions = async (withRedirect = false) => {
                const url = config.sessionUrl;
                // Prepare request body with redirectUrl if needed
                const requestBody = (withRedirect && config.redirectUrl) ?
                    { redirectUrl: config.redirectUrl } :
                    {};
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
                if (!response.ok) {
                    throw new Error(`Failed to create session: ${response.statusText}`);
                }
                const data = await response.json();
                return data.launchUrl;
            };
            switch (launchMode) {
                case 'popup':
                    // Using custom popup launcher with better closure detection
                    try {
                        verificationResult = await launchPopupWithClosureDetection(async () => {
                            return await createSessionWithOptions();
                        });
                    }
                    catch (popupError) {
                        // Handle the error according to Trinsic's pattern
                        if (popupError && typeof popupError === 'object' && 'success' in popupError) {
                            // This is a TrinsicSessionResult from cancellation
                            verificationResult = popupError;
                        }
                        else {
                            // This is a different error - rethrow it
                            throw popupError;
                        }
                    }
                    break;
                case 'iframe':
                    const launchUrl = await createSessionWithOptions();
                    verificationResult = await launchIframe(launchUrl);
                    break;
                case 'redirect':
                    const redirectLaunchUrl = await createSessionWithOptions(true);
                    await launchRedirect(redirectLaunchUrl);
                    context.dispatch({ type: 'SET_RESULT', payload: { success: true } }); // Redirect doesn't return a result
                    context.dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                default:
                    throw new Error(`Invalid launch mode: ${launchMode}`);
            }
            if (verificationResult && verificationResult.success) {
                // Exchange the result if exchangeUrl is provided
                if (config.exchangeUrl) {
                    const exchangeResponse = await fetch(config.exchangeUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(verificationResult),
                    });
                    if (exchangeResponse.ok) {
                        const exchangeData = await exchangeResponse.json();
                        context.dispatch({ type: 'SET_RESULT', payload: { success: true, data: exchangeData } });
                    }
                    else {
                        context.dispatch({ type: 'SET_RESULT', payload: { success: false, error: 'Failed to exchange result' } });
                    }
                }
                else {
                    // If no exchangeUrl provided, just return the verification result
                    context.dispatch({ type: 'SET_RESULT', payload: { success: true, data: verificationResult } });
                }
            }
            else {
                // Handle different failure types based on message
                const msg = verificationResult?.msg || 'unknown';
                let errorType = 'error';
                let errorMessage = 'Verification failed';
                switch (msg) {
                    case 'user-closed':
                        errorType = 'cancelled';
                        errorMessage = 'User cancelled verification';
                        break;
                    case 'failed':
                        errorType = 'failed';
                        errorMessage = 'Verification failed';
                        break;
                    case 'unrecoverable-error':
                        errorType = 'error';
                        errorMessage = 'Unrecoverable error occurred';
                        break;
                    default:
                        errorType = 'error';
                        errorMessage = `Verification failed: ${msg}`;
                }
                context.dispatch({
                    type: 'SET_RESULT',
                    payload: {
                        success: false,
                        error: errorMessage,
                        errorType,
                        cancelled: msg === 'user-closed'
                    }
                });
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            context.dispatch({ type: 'SET_ERROR', payload: errorMessage });
            context.dispatch({ type: 'SET_RESULT', payload: { success: false, error: errorMessage } });
        }
        finally {
            context.dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [options, context]);
    // Return context with launch function that uses provider config when no options provided
    return {
        ...context,
        launch: launchWithOptions,
    };
};
// Unified hook that accepts mode and options - mode is now required
const useTrinsic = (mode, options) => {
    const context = useTrinsicBase(options);
    return {
        ...context,
        launch: () => context.launch(mode),
    };
};
// Three specific hooks for different launch modes
const useTrinsicPopup = (options) => {
    const context = useTrinsicBase(options);
    const popupLaunch = useCallback(async () => {
        return await context.launch('popup');
    }, [context]);
    return {
        ...context,
        launch: popupLaunch,
    };
};
const useTrinsicRedirect = (options) => {
    const context = useTrinsicBase(options);
    const redirectLaunch = useCallback(async () => {
        return await context.launch('redirect');
    }, [context]);
    return {
        ...context,
        launch: redirectLaunch,
    };
};
const useTrinsicIframe = (options) => {
    const context = useTrinsicBase(options);
    const iframeLaunch = useCallback(async () => {
        return await context.launch('iframe');
    }, [context]);
    return {
        ...context,
        launch: iframeLaunch,
    };
};

const TrinsicTrigger = ({ sessionUrl, redirectUrl, exchangeUrl, mode = 'popup', asChild = false, children, disabled = false, onClick, ...props }) => {
    // Only pass options if any are provided, otherwise use provider defaults
    const options = (sessionUrl || redirectUrl || exchangeUrl) ?
        { sessionUrl, redirectUrl, exchangeUrl } :
        undefined;
    // Use the unified hook with mode and optional options
    const { launch, isLoading } = useTrinsic(mode, options);
    // If asChild is true, clone the child and pass the trigger props
    if (asChild) {
        if (!children || !React.isValidElement(children)) {
            throw new Error('TrinsicTrigger with asChild requires a single valid React element as children');
        }
        return React.cloneElement(children, {
            ...props,
            onClick: (e) => {
                // Call the original onClick if it exists
                children.props.onClick?.(e);
                // Call our launch handler
                launch();
            },
            disabled: disabled || isLoading || children.props.disabled,
        });
    }
    // Default button rendering when asChild is false - completely unstyled
    return (jsxRuntimeExports.jsx("button", { onClick: launch, ...props, disabled: disabled || isLoading, children: children }));
};

export { TrinsicProvider, TrinsicTrigger, useTrinsic, useTrinsicIframe, useTrinsicPopup, useTrinsicRedirect };
//# sourceMappingURL=index.esm.js.map
