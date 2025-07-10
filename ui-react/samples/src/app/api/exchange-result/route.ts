import { NextRequest, NextResponse } from 'next/server';
import { Configuration, SessionsApi } from '@trinsic/api';

export async function POST(req: NextRequest) {
  const accessToken = process.env.TRINSIC_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing TRINSIC_ACCESS_TOKEN' }, { status: 500 });
  }

  try {
    const body = await req.json();
    
    // Handle both formats: direct sessionId/accessKey or nested in verification result
    const sessionId = body.sessionId;
    const accessKey = body.accessKey || body.resultsAccessKey;
    
    if (!sessionId || !accessKey) {
      return NextResponse.json({ error: 'Missing sessionId or accessKey/resultsAccessKey' }, { status: 400 });
    }
    
    const config = new Configuration({ accessToken });
    const sessions = new SessionsApi(config);
    const result = await sessions.getSessionResult(sessionId, { resultsAccessKey: accessKey });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 