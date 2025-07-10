import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all API routes
        source: '/api/:path*',
        headers: [
          // Prevent iframe embedding (clickjacking protection)
          { key: 'X-Frame-Options', value: 'DENY' },
          
          // Prevent MIME sniffing attacks
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          
          // Control referrer information for privacy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          
          // Enable browser XSS protection
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          
          // Force HTTPS for all future requests
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          
          // Content Security Policy - restrict resource loading
          { 
            key: 'Content-Security-Policy', 
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://trinsic.id https://api.trinsic.id https://content.trinsic.id",
              "frame-src https://trinsic.id https://api.trinsic.id https://content.trinsic.id",
              "connect-src 'self' https://trinsic.id https://api.trinsic.id https://content.trinsic.id",
              "style-src 'self' 'unsafe-inline' https://content.trinsic.id",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          
          // Prevent browsers from detecting file types
          { key: 'X-Download-Options', value: 'noopen' },
          
          // Disable browser features that could be exploited
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          
          // Cache control for API responses
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' }
        ],
      },
      {
        // Apply basic security headers to all pages
        source: '/(.*)',
        headers: [
          // Prevent iframe embedding
          { key: 'X-Frame-Options', value: 'DENY' },
          
          // Prevent MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          
          // Control referrer information
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          
          // Enable XSS protection
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          
          // Force HTTPS
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          
          // Content Security Policy for pages
          { 
            key: 'Content-Security-Policy', 
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://trinsic.id https://api.trinsic.id https://content.trinsic.id",
              "frame-src https://trinsic.id https://api.trinsic.id https://content.trinsic.id",
              "connect-src 'self' https://trinsic.id https://api.trinsic.id https://content.trinsic.id",
              "style-src 'self' 'unsafe-inline' https://content.trinsic.id",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          
          // Prevent file type detection
          { key: 'X-Download-Options', value: 'noopen' },
          
          // Disable cross-domain policies
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' }
        ],
      },
    ];
  },
};

export default nextConfig;
