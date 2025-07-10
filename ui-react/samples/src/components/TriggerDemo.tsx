'use client'

import { TrinsicTrigger } from '@htinney/trinsic-react-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function TriggerDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Trigger Component Demo
        </CardTitle>
        <CardDescription>
          Use the TrinsicTrigger component for easy integration with different modes and variants.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Component: TrinsicTrigger</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            The TrinsicTrigger component provides a simple way to add verification buttons 
            with built-in loading states and error handling.
          </p>
        </div>

        <div className="space-y-4 [&_button]:!bg-white [&_button]:!text-black [&_button]:!border [&_button]:!border-gray-300 [&_button]:!px-3 [&_button]:!py-2 [&_button]:!rounded [&_button]:!text-sm [&_button]:!font-normal [&_button]:!shadow-sm [&_button:hover]:!bg-gray-50 [&_button:focus]:!outline-none [&_button:focus]:!ring-2 [&_button:focus]:!ring-blue-500 [&_button:focus]:!ring-offset-2 [&_button:disabled]:!opacity-50 [&_button:disabled]:!cursor-not-allowed">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Default Button (Popup Mode)</h4>
            <TrinsicTrigger mode="popup">
              Start Widget Verification
            </TrinsicTrigger>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Hosted Mode Button</h4>
            <TrinsicTrigger mode="redirect">
              Start Hosted Verification
            </TrinsicTrigger>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Advanced Mode Button</h4>
            <TrinsicTrigger mode="iframe">
              Start Advanced Verification
            </TrinsicTrigger>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Using asChild with Custom Button</h4>
            <TrinsicTrigger mode="popup" asChild>
              <Button variant="outline" className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" />
                Custom Styled Button
              </Button>
            </TrinsicTrigger>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Default button with built-in styling</p>
          <p>• Different modes: popup, redirect, iframe</p>
          <p>• asChild prop for custom button styling</p>
          <p>• Automatic loading states and error handling</p>
        </div>
      </CardContent>
    </Card>
  )
} 