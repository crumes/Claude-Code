import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const clientId = request.nextUrl.searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('client_id', clientId)
      .order('session_date', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ sessions: data }, { status: 200 });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, coachId, sessionDate, exerciseName, sets, reps, weight, notes, status } =
      body;

    if (!clientId || !coachId) {
      return NextResponse.json(
        { error: 'Client ID and Coach ID are required' },
        { status: 400 }
      );
    }

    if (!sessionDate || !exerciseName) {
      return NextResponse.json(
        { error: 'Session date and exercise name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        client_id: clientId,
        coach_id: coachId,
        session_date: sessionDate,
        exercise_name: exerciseName.trim(),
        sets: sets || null,
        reps: reps || null,
        weight: weight?.trim() || null,
        notes: notes?.trim() || null,
        status: status || 'completed',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Session logged successfully', session: data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
