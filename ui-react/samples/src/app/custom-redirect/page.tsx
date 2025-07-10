'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'

interface VerificationResult {
  success: boolean
  sessionId?: string
  resultsAccessKey?: string
  [key: string]: unknown
}

export default function CustomRedirectPage() {
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Extract verification results from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const sessionId = urlParams.get('sessionId')
    const resultsAccessKey = urlParams.get('resultsAccessKey')

    if (success === 'true' && sessionId && resultsAccessKey) {
      // Exchange the results
      exchangeResults(sessionId, resultsAccessKey)
    } else {
      setError('No verification results found in URL')
      setIsLoading(false)
    }
  }, [])

  const exchangeResults = async (sessionId: string, resultsAccessKey: string) => {
    try {
      const response = await fetch('/api/exchange-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          resultsAccessKey,
          success: true
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        setError('Failed to exchange verification results')
      }
    } catch {
      setError('Error exchanging verification results')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-600" />
            Custom Redirect Page
          </CardTitle>
          <CardDescription>
            This is a custom redirect page for the OverrideRedirectDemo. 
            You were redirected here because the demo overrode the default redirect URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
              Custom Redirect
            </Badge>
            <Badge variant="secondary">
              Override Demo
            </Badge>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Processing verification results...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Verification Completed
                </Badge>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Verification Results:</h4>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Demo
              </Button>
            </Link>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• This page demonstrates a custom redirect URL override</p>
            <p>• The default redirect would have gone to /redirect</p>
            <p>• This custom page shows the same verification results</p>
            <p>• Useful for different user flows or environments</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 