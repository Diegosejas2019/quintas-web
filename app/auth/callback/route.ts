import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (code) {
    // Exchange code for session — Supabase handles this client-side via the hash fragment
    // Just redirect to home; the client-side Providers component will pick up the session
  }

  return NextResponse.redirect(new URL('/', request.url))
}
