'use client'

import { useTrinsicIframe } from '@htinney/trinsic-react-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Settings, AlertCircle, Loader2 } from 'lucide-react'

export default function AdvancedDemo() {
    
  const { launch, isLoading, error, result } = useTrinsicIframe()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-600" />
          iFrame Mode Demo
        </CardTitle>
        <CardDescription>
          Launch a verification session embedded in an iframe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Launch Mode: iFrame</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            The verification will be embedded in an iframe within your page. This provides 
            the most seamless integration but may have some browser restrictions.
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
              <Settings className="mr-2 h-4 w-4" />
              Start iFrame Verification
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