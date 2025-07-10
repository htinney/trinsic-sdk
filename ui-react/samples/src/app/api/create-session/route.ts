import { NextRequest, NextResponse } from 'next/server';
import { Configuration, SessionsApi } from '@trinsic/api';

// Define interface for response error
interface ResponseError {
  response: {
    status: number;
    text(): Promise<string>;
  };
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.TRINSIC_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing TRINSIC_ACCESS_TOKEN' }, { status: 500 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { redirectUrl } = body;
    
    const config = new Configuration({ accessToken });
    const sessions = new SessionsApi(config);
    
    // Create session with redirectUrl if provided
    const result = redirectUrl ? 
      await sessions.createWidgetSession({ redirectUrl }) : 
      await sessions.createWidgetSession();
    
    return NextResponse.json({ launchUrl: result.launchUrl });
  } catch (error) {
    // If it's a ResponseError from the Trinsic API, log more details
    if (error && typeof error === 'object' && 'response' in error) {
      const responseError = error as ResponseError;
      try {
        const errorText = await responseError.response.text();
        return NextResponse.json({ 
          error: `Trinsic API error: ${responseError.response.status} - ${errorText}` 
        }, { status: 500 });
      } catch {
        // Could not parse error response
      }
    }
    
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 