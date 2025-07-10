# Trinsic React UI SDK - Next.js Samples

A Next.js application demonstrating Trinsic React UI SDK integration with digital identity verification flows. Features multiple launch modes and a modern UI built with shadcn/ui and Tailwind CSS.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhtinney%2Ftrinsic-sdk%2Ftree%2Fmain%2Fui-react%2Fsamples&env=TRINSIC_ACCESS_TOKEN&envDescription=Trinsic%20API%20Key&envLink=https%3A%2F%2Fdashboard.trinsic.id%2F&redirect-url=https%3A%2F%2Fdashboard.trinsic.id%2F)

## Features

- **Multiple Launch Modes**: Popup, redirect, and iframe verification flows
- **Real-time Results**: Display verification results as they complete
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **TypeScript**: Full type safety and IntelliSense support

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [@htinney/trinsic-react-ui](../sdk)

## Quick Start

### Prerequisites

1. Node.js 18 or higher
2. Trinsic account and access token
3. Build the React SDK: `npm run build` in `ui-react/sdk`

### Local Development

#### Option 1: Using Published SDK (Recommended for most users)
1. **Install dependencies:**
   ```bash
   cd ui-react/samples
   npm ci
   ```

2. **Set up environment:**
   ```bash
   cp example.env.local .env.local
   # Edit .env.local and add your TRINSIC_ACCESS_TOKEN
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

#### Option 2: Using Local SDK (For SDK development)
If you're actively developing the SDK and want to test changes immediately:

1. **Switch to local SDK:**
   ```bash
   cd ui-react/samples
   powershell -ExecutionPolicy Bypass -File dev-setup.ps1 -UseLocal
   ```

2. **Set up environment:**
   ```bash
   cp example.env.local .env.local
   # Edit .env.local and add your TRINSIC_ACCESS_TOKEN
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **When ready to deploy, switch back to published SDK:**
   ```bash
   powershell -ExecutionPolicy Bypass -File dev-setup.ps1 -UsePublished
   ```

### Vercel Deployment

1. Click the "Deploy with Vercel" button above
2. Add your `TRINSIC_ACCESS_TOKEN` environment variable
3. Deploy and test your verification flows

## Demo Components

### WidgetDemo
Popup-based verification with real-time result display. Uses provider configuration.

### HostedDemo
Full-page redirect verification for mobile-friendly experiences. Uses provider configuration.

### AdvancedDemo
iFrame-embedded verification for seamless integration. Uses provider configuration.

### TriggerDemo
Pre-built button components with different modes. Uses provider configuration.

### OverrideRedirectDemo
Demonstrates overriding the redirect URL while using provider defaults for other settings.

## API Endpoints

This sample includes these API routes as examples:

- `POST /api/create-session` - Create verification session
- `POST /api/exchange-result` - Exchange verification results

**Note**: These are just example endpoint names. In your own application, you can name your endpoints anything you want - just make sure to set the correct `sessionUrl` and `exchangeUrl` in your `TrinsicProvider` configuration.

## Usage Examples

### Simple Setup with Provider Configuration

```tsx
import { TrinsicProvider, useTrinsicPopup } from '@htinney/trinsic-react-ui';

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
  const { launch, isLoading, error, result } = useTrinsicPopup();

  return (
    <button onClick={launch} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Start Verification'}
    </button>
  );
}
```

### Override Specific Configuration

```tsx
function CustomRedirectComponent() {
  const { launch, isLoading, error, result } = useTrinsicPopup({
    redirectUrl: window.location.origin + '/custom-redirect' // Override only redirectUrl
  });

  return (
    <button onClick={launch} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Start Custom Verification'}
    </button>
  );
}
```

### Using TrinsicTrigger Component

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

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── create-session/  # Session creation endpoint
│   │   └── exchange-result/ # Result exchange endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── WidgetDemo.tsx       # Popup demo
│   ├── HostedDemo.tsx       # Redirect demo
│   ├── AdvancedDemo.tsx     # iFrame demo
│   └── TriggerDemo.tsx      # Component demo
└── lib/
    └── utils.ts             # Utility functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding Components

```bash
npx shadcn@latest add [component-name]
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TRINSIC_ACCESS_TOKEN` | Your Trinsic API access token | Yes |

## Redirect URL Configuration

**Important**: To use the redirect mode demonstration (HostedDemo component), you must configure approved redirect URLs in your Trinsic dashboard.

### Quick Setup Guide

1. **Access Your Trinsic Dashboard**
   - Go to [https://dashboard.trinsic.id](https://dashboard.trinsic.id)
   - Navigate to your application/project settings

2. **Add Redirect URLs**
   
   **For Local Development:**
   Add this URL to your approved redirect URIs:
   ```
   http://localhost:3000/redirect
   ```

   **For Production Deployment:**
   Add your production URL to approved redirect URIs:
   ```
   https://yourdomain.com/redirect
   ```

### Why This is Required

Trinsic requires redirect URLs to be pre-approved for security reasons. This prevents redirect attacks and ensures users can only be redirected to authorized URLs after verification.

### Common Deployment Scenarios

#### Vercel Deployment
When deploying to Vercel, add these URLs to your Trinsic dashboard:

```
# Production
https://your-app.vercel.app/redirect

# Preview deployments (optional, for testing)
https://your-app-git-main-team.vercel.app/redirect
```

#### Custom Domain
```
# Staging
https://staging.yourdomain.com/redirect

# Production  
https://yourdomain.com/redirect
```

#### Multiple Development Ports
If your team uses different ports for development:
```
http://localhost:3000/redirect
http://localhost:3001/redirect
http://localhost:4000/redirect
```

### Troubleshooting

**Error: "URI has not been added to this app's approved redirect URIs list"**

This error means the redirect URL isn't approved. To fix:

1. Check your current URL in the browser
2. Add the exact URL + `/redirect` to your Trinsic dashboard
3. Ensure protocol matches (`http://` for localhost, `https://` for production)
4. Wait a few minutes for changes to propagate

**Error: "Redirect URL is required for this launch mode"**

This error means your session creation isn't receiving the redirect URL. Check:

1. Environment variables are set correctly
2. The redirect URL is being passed to the session creation API
3. Your API route is handling the redirect URL properly

### Testing the Redirect Flow

After configuring redirect URLs:

1. Start your development server: `npm run dev`
2. Navigate to [http://localhost:3000](http://localhost:3000)
3. Click "Start Redirect Verification" in the HostedDemo component
4. Complete the verification flow
5. You'll be redirected back to `/redirect` with the results

The redirect page will automatically:
- Extract verification results from URL parameters
- Exchange them using your API
- Display the final verification data