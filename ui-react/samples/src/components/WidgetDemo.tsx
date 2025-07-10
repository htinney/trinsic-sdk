'use client'

import { useTrinsicPopup } from '@htinney/trinsic-react-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function WidgetDemo() {

  const { launch, isLoading, error, result } = useTrinsicPopup()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Popup Mode Demo
        </CardTitle>
        <CardDescription>
          Launch a verification session in a popup window.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Launch Mode: Popup</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            The verification will open in a popup window. This is ideal for quick verifications 
            that don&apos;t require leaving your application.
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
              <CheckCircle className="mr-2 h-4 w-4" />
              Start Popup Verification
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
              {result.cancelled ? (
                <Badge variant="outline" className="border-orange-500 text-orange-700">
                  User Cancelled
                </Badge>
              ) : result.success ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Verification Success
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Verification Failed
                </Badge>
              )}
            </div>
            
            {result.cancelled && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  The user closed the verification window. No identity data was captured.
                </AlertDescription>
              </Alert>
            )}
            
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 