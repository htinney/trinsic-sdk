# Trinsic React UI SDK

A React SDK for integrating Trinsic's digital identity verification flows into React applications with TypeScript support and multiple launch modes.

## Features

- **React Components**: Pre-built components for verification flows
- **React Hooks**: Custom hooks for state management and results
- **TypeScript Support**: Full type safety and definitions
- **Multiple Launch Modes**: Popup, redirect, and iframe support
- **Session Management**: Easy session creation and result handling

## Installation

```bash
npm install @htinney/trinsic-react-ui
```

## Quick Start

### Simple Setup with Provider Configuration

```tsx
import React from 'react';
import { TrinsicProvider, useTrinsic } from '@htinney/trinsic-react-ui';

function App() {
  return (
    <TrinsicProvider
      sessionUrl="/api/create-session"
      redirectUrl={window.location.origin + '/redirect'}
      exchangeUrl="/api/exchange-result"
    >
      <VerificationComponent />
    </TrinsicProvider>
  );
}

function VerificationComponent() {
  const { launch, isLoading, error, result } = useTrinsic('popup');

  return (
    <button onClick={launch} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Start Verification'}
    </button>
  );
}
```

### Alternative: Per-Hook Configuration with Overrides

```tsx
import React from 'react';
import { TrinsicProvider, useTrinsic } from '@htinney/trinsic-react-ui';

function App() {
  return (
    <TrinsicProvider
      sessionUrl="/api/create-session"
      redirectUrl={window.location.origin + '/redirect'}
      exchangeUrl="/api/exchange-result"
    >
      <VerificationComponent />
    </TrinsicProvider>
  );
}

function VerificationComponent() {
  // Override only the redirectUrl, use provider defaults for others
  const { launch, isLoading, error, result } = useTrinsic('popup', {
    redirectUrl: window.location.origin + '/custom-redirect'
  });

  return (
    <button onClick={launch} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Start Verification'}
    </button>
  );
}
```

## Available Hooks

### `useTrinsic(mode, options?)`
Main hook for launching verification sessions with a specific mode.

```tsx
// With provider configuration (recommended)
const { launch, isLoading, error, result } = useTrinsic('popup');

// With full per-hook configuration
const { launch, isLoading, error, result } = useTrinsic('popup', {
  sessionUrl: '/api/create-session',
  redirectUrl: window.location.origin + '/redirect',
  exchangeUrl: '/api/exchange-result'
});

// With sparse overrides (uses provider defaults for unspecified options)
const { launch, isLoading, error, result } = useTrinsic('popup', {
  redirectUrl: window.location.origin + '/custom-redirect' // Only override redirectUrl
});
```

### `useTrinsicPopup(options?)`
Specialized hook for popup mode with built-in state management.

```tsx
// With provider configuration (recommended)
const { launch, isLoading, error, result } = useTrinsicPopup();

// With per-hook configuration
const { launch, isLoading, error, result } = useTrinsicPopup({
  sessionUrl: '/api/create-session',
  redirectUrl: window.location.origin + '/redirect',
  exchangeUrl: '/api/exchange-result'
});
```

### `useTrinsicRedirect(options?)`
Specialized hook for redirect mode.

```tsx
// With provider configuration (recommended)
const { launch, isLoading, error, result } = useTrinsicRedirect();

// With per-hook configuration
const { launch, isLoading, error, result } = useTrinsicRedirect({
  sessionUrl: '/api/create-session',
  redirectUrl: window.location.origin + '/redirect',
  exchangeUrl: '/api/exchange-result'
});
```

### `useTrinsicIframe(options?)`
Specialized hook for iframe mode.

```tsx
// With provider configuration (recommended)
const { launch, isLoading, error, result } = useTrinsicIframe();

// With per-hook configuration
const { launch, isLoading, error, result } = useTrinsicIframe({
  sessionUrl: '/api/create-session',
  redirectUrl: window.location.origin + '/redirect',
  exchangeUrl: '/api/exchange-result'
});
```

## Components

### `TrinsicTrigger`
Pre-built button component with built-in styling and states.

```tsx
import { TrinsicTrigger } from '@htinney/trinsic-react-ui';

// With provider configuration (recommended)
<TrinsicTrigger mode="popup">
  Start Verification
</TrinsicTrigger>

// With per-component configuration
<TrinsicTrigger
  sessionUrl="/api/create-session"
  redirectUrl={window.location.origin + '/redirect'}
  exchangeUrl="/api/exchange-result"
  mode="popup"
>
  Start Verification
</TrinsicTrigger>
```

#### Using `asChild` for Custom Styling

```tsx
import { TrinsicTrigger } from '@htinney/trinsic-react-ui';
import { Button } from '@/components/ui/button';

<TrinsicTrigger mode="popup" asChild>
  <Button variant="outline" className="w-full">
    <CheckCircle className="mr-2 h-4 w-4" />
    Custom Styled Button
  </Button>
</TrinsicTrigger>
```

## Launch Modes

- **Popup**: Opens verification in a popup window
- **Redirect**: Redirects the entire page to verification flow
- **iFrame**: Embeds verification flow in an iframe

## Configuration Overrides

The SDK supports flexible configuration through provider defaults with hook-level overrides:

### Provider Configuration (Recommended)
Set default configuration in `TrinsicProvider`:
```tsx
<TrinsicProvider
  sessionUrl="/api/create-session"
  redirectUrl={window.location.origin + '/redirect'}
  exchangeUrl="/api/exchange-result"
>
  {/* Your app */}
</TrinsicProvider>
```

### Hook-Level Overrides
Hooks can override any provider configuration:
```tsx
// Use all provider defaults
const { launch } = useTrinsicPopup();

// Override only redirectUrl
const { launch } = useTrinsicPopup({ redirectUrl: window.location.origin + '/custom-redirect' });

// Override multiple options
const { launch } = useTrinsicPopup({ 
  redirectUrl: window.location.origin + '/custom-redirect',
  exchangeUrl: '/api/custom-exchange'
});
```

## API Requirements

Your backend needs to provide these endpoints (the names are flexible):

- **Session Creation**: Any endpoint that creates a verification session
- **Result Exchange**: Any endpoint that exchanges verification results

The SDK will call these endpoints using the URLs you provide via `sessionUrl` and `exchangeUrl` parameters. For example:

```tsx
// Your endpoints can be named anything
<TrinsicProvider
  sessionUrl="/api/verification/create"  // Your custom endpoint
  exchangeUrl="/api/verification/complete"  // Your custom endpoint
>
  {/* Your app */}
</TrinsicProvider>
```

## Examples

See the [samples directory](./samples) for complete working examples.