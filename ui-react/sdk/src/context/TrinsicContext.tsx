import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { launchPopup, launchRedirect, launchIframe, TrinsicSessionResult } from '@trinsic/web-ui';
import type { LaunchMode, VerificationResult, UseTrinsicOptions } from '../types';

// Custom popup launcher with better closure detection
const launchPopupWithClosureDetection = async (
  getLaunchUrl: () => Promise<string>,
  loadingDomain?: string,
  relyingPartyName?: string
): Promise<TrinsicSessionResult> => {
  const userAgents = detectUserAgents();
  const popup = window.open(
    `https://${loadingDomain || "api.trinsic.id"}/loading`,
    relyingPartyName || "Trinsic",
    userAgents.isDesktop
      ? "width=600,height=900"
      : "width=" +
          window.innerWidth +
          ",height=" +
          window.innerHeight +
          ",top=0,left=0"
  );

  if (!popup) {
    throw new Error("Failed to open popup window");
  }

  // Safely retrieve a launch url and close the popup on failure.
  let launchUrl = "";
  try {
    launchUrl = await getLaunchUrl();
    if(!launchUrl) {
      throw new Error("Launch URL is empty");
    }
  }
      catch(error) {
      try {
        popup.close();
      }
      catch(error) {
        // Error closing popup - continue with original error
      }
      throw error;
    }

  launchUrl += "&launchMode=popup";
  popup.location.href = launchUrl;

  return new Promise<TrinsicSessionResult>((resolve, reject) => {
    let messageHandler: ((event: MessageEvent) => void) | null = null;
    let closureChecker: number | null = null;
    let isResolved = false;

    const cleanup = () => {
      if (messageHandler) {
        window.removeEventListener("message", messageHandler);
      }
      if (closureChecker) {
        clearInterval(closureChecker);
      }
    };

    const resolveWithCleanup = (result: TrinsicSessionResult) => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        resolve(result);
      }
    };

    const rejectWithCleanup = (error: any) => {
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
        } catch (error) {
          // Error closing popup - continue
        }
        resolveWithCleanup(event.data as TrinsicSessionResult);
      }
      if (event.data?.success === false) {
        try {
          popup?.close();
        } catch (error) {
          // Error closing popup - continue
        }
        rejectWithCleanup(event.data as TrinsicSessionResult);
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

interface TrinsicState {
  sessionUrl: string | null;
  redirectUrl: string | null;
  exchangeUrl: string | null;
  isLoading: boolean;
  error: string | null;
  result: VerificationResult | null;
}

type TrinsicAction = 
  | { type: 'SET_CONFIG'; payload: { sessionUrl: string; redirectUrl?: string; exchangeUrl?: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_RESULT'; payload: VerificationResult | null };

const initialState: TrinsicState = {
  sessionUrl: null,
  redirectUrl: null,
  exchangeUrl: null,
  isLoading: false,
  error: null,
  result: null,
};

function trinsicReducer(state: TrinsicState, action: TrinsicAction): TrinsicState {
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

interface TrinsicContextValue extends TrinsicState {
  launch: (launchMode: LaunchMode) => Promise<void>;
  setConfig: (sessionUrl: string, redirectUrl?: string, exchangeUrl?: string) => void;
  dispatch: React.Dispatch<TrinsicAction>;
}

const TrinsicContext = createContext<TrinsicContextValue | undefined>(undefined);

interface TrinsicProviderProps {
  children: React.ReactNode;
  sessionUrl?: string;
  redirectUrl?: string;
  exchangeUrl?: string;
}

export const TrinsicProvider: React.FC<TrinsicProviderProps> = ({ 
  children, 
  sessionUrl, 
  redirectUrl, 
  exchangeUrl 
}) => {
  const [state, dispatch] = useReducer(trinsicReducer, initialState);

  const setConfig = useCallback((sessionUrl: string, redirectUrl?: string, exchangeUrl?: string) => {
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

  const launch = useCallback(async (launchMode: LaunchMode): Promise<void> => {
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
          } else {
            dispatch({ type: 'SET_RESULT', payload: { success: false, error: 'Failed to exchange result' } });
          }
        } else {
          // If no exchangeUrl provided, just return the verification result
          dispatch({ type: 'SET_RESULT', payload: { success: true, data: verificationResult } });
        }
      } else {
        dispatch({ type: 'SET_RESULT', payload: { success: false, error: 'Verification failed' } });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_RESULT', payload: { success: false, error: errorMessage } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [createSession, state.exchangeUrl]);

  const value: TrinsicContextValue = {
    ...state,
    launch,
    setConfig,
    dispatch,
  };

  return (
    <TrinsicContext.Provider value={value}>
      {children}
    </TrinsicContext.Provider>
  );
};

// Base hook that sets config and returns launch function
const useTrinsicBase = (options?: UseTrinsicOptions): TrinsicContextValue => {
  const context = useContext(TrinsicContext);
  if (context === undefined) {
    throw new Error('useTrinsic must be used within a TrinsicProvider');
  }

  // Memoize the launch function with options
  const launchWithOptions = useCallback(async (launchMode: LaunchMode): Promise<void> => {
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
        const url = config.sessionUrl!;
        
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
          } catch (popupError) {
            // Handle the error according to Trinsic's pattern
            if (popupError && typeof popupError === 'object' && 'success' in popupError) {
              // This is a TrinsicSessionResult from cancellation
              verificationResult = popupError as TrinsicSessionResult;
            } else {
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
          } else {
            context.dispatch({ type: 'SET_RESULT', payload: { success: false, error: 'Failed to exchange result' } });
          }
        } else {
          // If no exchangeUrl provided, just return the verification result
          context.dispatch({ type: 'SET_RESULT', payload: { success: true, data: verificationResult } });
        }
      } else {
        // Handle different failure types based on message
        const msg = verificationResult?.msg || 'unknown';
        let errorType: 'cancelled' | 'failed' | 'error' = 'error';
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      context.dispatch({ type: 'SET_ERROR', payload: errorMessage });
      context.dispatch({ type: 'SET_RESULT', payload: { success: false, error: errorMessage } });
    } finally {
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
export const useTrinsic = (mode: LaunchMode, options?: UseTrinsicOptions) => {
  const context = useTrinsicBase(options);
  return {
    ...context,
    launch: () => context.launch(mode),
  };
};

// Three specific hooks for different launch modes
export const useTrinsicPopup = (options?: UseTrinsicOptions) => {
  const context = useTrinsicBase(options);
  
  const popupLaunch = useCallback(async () => {
    return await context.launch('popup');
  }, [context]);
  
  return {
    ...context,
    launch: popupLaunch,
  };
};

export const useTrinsicRedirect = (options?: UseTrinsicOptions) => {
  const context = useTrinsicBase(options);
  
  const redirectLaunch = useCallback(async () => {
    return await context.launch('redirect');
  }, [context]);
  
  return {
    ...context,
    launch: redirectLaunch,
  };
};

export const useTrinsicIframe = (options?: UseTrinsicOptions) => {
  const context = useTrinsicBase(options);
  
  const iframeLaunch = useCallback(async () => {
    return await context.launch('iframe');
  }, [context]);
  
  return {
    ...context,
    launch: iframeLaunch,
  };
}; 