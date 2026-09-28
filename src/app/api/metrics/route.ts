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
    const metricType = request.nextUrl.searchParams.get('metricType');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('metrics')
      .select('*')
      .eq('client_id', clientId)
      .order('metric_date', { ascending: false });

    if (metricType) {
      query = query.eq('metric_type', metricType);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ metrics: data }, { status: 200 });
  } catch (error) {
    console.error('Get metrics error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, coachId, metricDate, metricType, metricName, value, unit, notes } = body;

    if (!clientId || !coachId) {
      return NextResponse.json(
        { error: 'Client ID and Coach ID are required' },
        { status: 400 }
      );
    }

    if (!metricDate || !metricType || !metricName || value === undefined) {
      return NextResponse.json(
        { error: 'Metric date, type, name, and value are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('metrics')
      .insert({
        client_id: clientId,
        coach_id: coachId,
        metric_date: metricDate,
        metric_type: metricType,
        metric_name: metricName.trim(),
        value: parseFloat(value),
        unit: unit?.trim() || null,
        notes: notes?.trim() || null,
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
      { message: 'Metric logged successfully', metric: data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create metric error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
