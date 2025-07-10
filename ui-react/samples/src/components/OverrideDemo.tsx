'use client'

import React from 'react'
import { TrinsicProvider, useTrinsicRedirect } from '@htinney/trinsic-react-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Loader2, Zap } from 'lucide-react'

// Component that uses provider defaults
function DefaultComponent() {
  const { launch, isLoading } = useTrinsicRedirect();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline">Default Redirect</Badge>
      </div>
      
      <Button 
        onClick={launch} 
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Use Default Redirect
          </>
        )}
      </Button>
    </div>
  );
}

// Component that overrides only redirectUrl
function OverrideComponent() {
  const { launch, isLoading } = useTrinsicRedirect({
    redirectUrl: typeof window !== 'undefined' ? window.location.origin + '/custom-redirect' : '' // Only override redirectUrl
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline">Custom Redirect</Badge>
        <Badge variant="secondary">Sparse Override</Badge>
      </div>
      
      <Button 
        onClick={launch} 
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" />
            Use Custom Redirect
          </>
        )}
      </Button>
    </div>
  );
}

export default function OverrideRedirectDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          Custom Redirect Demo
        </CardTitle>
        <CardDescription>
          Demonstrates overriding the redirect URL while using provider defaults for other settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This demo shows how hooks can override specific configuration options while using 
            provider defaults for the rest. The first component uses the default redirect, 
            while the second overrides only the redirectUrl to go to a custom page.
          </p>
        </div>

        <TrinsicProvider
          sessionUrl="/api/create-session"
          redirectUrl={typeof window !== 'undefined' ? window.location.origin + '/redirect' : ''}
          exchangeUrl="/api/exchange-result"
        >
          <div className="space-y-6">
            <DefaultComponent />
            <OverrideComponent />
          </div>
        </TrinsicProvider>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Top: Uses default redirect (/redirect)</p>
          <p>• Bottom: Overrides redirectUrl to go to custom page</p>
          <p>• Both use same sessionUrl and exchangeUrl from provider</p>
          <p>• Flexible configuration without repetition</p>
        </div>
      </CardContent>
    </Card>
  )
} 