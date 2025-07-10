'use client'

import { useTrinsicRedirect } from '@htinney/trinsic-react-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Globe, AlertCircle, Loader2 } from 'lucide-react'

export default function HostedDemo() {
  
  const { launch, isLoading, error, result } = useTrinsicRedirect()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Redirect Mode Demo
        </CardTitle>
        <CardDescription>
          Launch a verification session with a full page redirect.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Launch Mode: Redirect</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            The verification will redirect to a new page. This is ideal for mobile devices 
            or when you want a full-screen verification experience.
          </p>
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
              <Globe className="mr-2 h-4 w-4" />
              Start Redirect Verification
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Verification Result</Badge>
            </div>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 