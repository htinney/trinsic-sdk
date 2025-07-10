"use client";

import { TrinsicProvider } from '@htinney/trinsic-react-ui';
import WidgetDemo from '@/components/WidgetDemo';
import HostedDemo from '@/components/HostedDemo';
import AdvancedDemo from '@/components/AdvancedDemo';
import TriggerDemo from '@/components/TriggerDemo';
import OverrideRedirectDemo from '@/components/OverrideDemo';

export default function Home() {
  return (
    <TrinsicProvider
      sessionUrl="/api/create-session"
      redirectUrl={typeof window !== 'undefined' ? window.location.origin + '/redirect' : ''}
      exchangeUrl="/api/exchange-result"
    >
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Trinsic React UI SDK Samples
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              This application demonstrates how to use the Trinsic React UI SDK to integrate 
              digital identity verification flows into React applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <WidgetDemo />
            <HostedDemo />
            <AdvancedDemo />
            <TriggerDemo />
            <OverrideRedirectDemo />
          </div>
        </div>
      </div>
    </TrinsicProvider>
  );
}
