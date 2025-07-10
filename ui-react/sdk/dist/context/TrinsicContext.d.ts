import React from 'react';
import type { LaunchMode, VerificationResult, UseTrinsicOptions } from '../types';
type TrinsicAction = {
    type: 'SET_CONFIG';
    payload: {
        sessionUrl: string;
        redirectUrl?: string;
        exchangeUrl?: string;
    };
} | {
    type: 'SET_LOADING';
    payload: boolean;
} | {
    type: 'SET_ERROR';
    payload: string | null;
} | {
    type: 'SET_RESULT';
    payload: VerificationResult | null;
};
interface TrinsicProviderProps {
    children: React.ReactNode;
    sessionUrl?: string;
    redirectUrl?: string;
    exchangeUrl?: string;
}
export declare const TrinsicProvider: React.FC<TrinsicProviderProps>;
export declare const useTrinsic: (mode: LaunchMode, options?: UseTrinsicOptions) => {
    launch: () => Promise<void>;
    setConfig: (sessionUrl: string, redirectUrl?: string, exchangeUrl?: string) => void;
    dispatch: React.Dispatch<TrinsicAction>;
    sessionUrl: string | null;
    redirectUrl: string | null;
    exchangeUrl: string | null;
    isLoading: boolean;
    error: string | null;
    result: VerificationResult | null;
};
export declare const useTrinsicPopup: (options?: UseTrinsicOptions) => {
    launch: () => Promise<void>;
    setConfig: (sessionUrl: string, redirectUrl?: string, exchangeUrl?: string) => void;
    dispatch: React.Dispatch<TrinsicAction>;
    sessionUrl: string | null;
    redirectUrl: string | null;
    exchangeUrl: string | null;
    isLoading: boolean;
    error: string | null;
    result: VerificationResult | null;
};
export declare const useTrinsicRedirect: (options?: UseTrinsicOptions) => {
    launch: () => Promise<void>;
    setConfig: (sessionUrl: string, redirectUrl?: string, exchangeUrl?: string) => void;
    dispatch: React.Dispatch<TrinsicAction>;
    sessionUrl: string | null;
    redirectUrl: string | null;
    exchangeUrl: string | null;
    isLoading: boolean;
    error: string | null;
    result: VerificationResult | null;
};
export declare const useTrinsicIframe: (options?: UseTrinsicOptions) => {
    launch: () => Promise<void>;
    setConfig: (sessionUrl: string, redirectUrl?: string, exchangeUrl?: string) => void;
    dispatch: React.Dispatch<TrinsicAction>;
    sessionUrl: string | null;
    redirectUrl: string | null;
    exchangeUrl: string | null;
    isLoading: boolean;
    error: string | null;
    result: VerificationResult | null;
};
export {};
//# sourceMappingURL=TrinsicContext.d.ts.map