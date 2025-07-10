export type LaunchMode = 'popup' | 'redirect' | 'iframe';
export interface TrinsicConfig {
    sessionUrl: string;
    redirectUrl?: string;
    exchangeUrl?: string;
}
export interface VerificationResult {
    success: boolean;
    data?: any;
    error?: string;
    errorType?: 'cancelled' | 'failed' | 'error';
    cancelled?: boolean;
}
export interface TrinsicContextValue {
    launch: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
    result: VerificationResult | null;
}
export interface UseTrinsicOptions {
    sessionUrl?: string;
    redirectUrl?: string;
    exchangeUrl?: string;
}
//# sourceMappingURL=types.d.ts.map