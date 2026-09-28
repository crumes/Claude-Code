import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, type } = body;

    if (!token || type !== 'email') {
      return NextResponse.json(
        { error: 'Invalid token or type' },
        { status: 400 }
      );
    }

    // In Supabase, the token is the user's ID (UUID) from the confirmation email
    // For local development, we simply mark the user as email confirmed
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      token,
      { email_confirm: true }
    );

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || 'Verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
