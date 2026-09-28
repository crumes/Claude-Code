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
    const { studioName, email } = body;

    if (!studioName || typeof studioName !== 'string') {
      return NextResponse.json(
        { error: 'Studio name is required' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .select('id')
      .eq('email', email)
      .single();

    if (coachError || !coachData) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 400 }
      );
    }

    const { data: studioData, error: studioError } = await supabase
      .from('studios')
      .insert({
        name: studioName.trim(),
        created_by: coachData.id,
      })
      .select()
      .single();

    if (studioError || !studioData) {
      return NextResponse.json(
        { error: 'Failed to create studio' },
        { status: 500 }
      );
    }

    const { error: memberError } = await supabase
      .from('studio_members')
      .insert({
        studio_id: studioData.id,
        coach_id: coachData.id,
        role: 'admin',
      });

    if (memberError) {
      return NextResponse.json(
        { error: 'Failed to add coach to studio' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Studio created successfully', studioId: studioData.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Studio creation error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
