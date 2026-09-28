import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function convertToCSV(data: any[], headers: string[]): string {
  const csvHeaders = headers.join(',');
  const csvRows = data.map((row) =>
    headers.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  return [csvHeaders, ...csvRows].join('\n');
}

export async function GET(request: NextRequest) {
  try {
    const clientId = request.nextUrl.searchParams.get('clientId');
    const type = request.nextUrl.searchParams.get('type'); // 'sessions', 'metrics', or 'all'

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const { data: client } = await supabase
      .from('clients')
      .select('name, email')
      .eq('id', clientId)
      .single();

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    const csvParts: string[] = [];

    if (type === 'sessions' || type === 'all') {
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('client_id', clientId)
        .order('session_date', { ascending: false });

      if (sessions && sessions.length > 0) {
        const headers = ['Date', 'Exercise', 'Sets', 'Reps', 'Weight', 'Status', 'Notes'];
        const formattedSessions = sessions.map((s) => ({
          Date: s.session_date,
          Exercise: s.exercise_name,
          Sets: s.sets || '',
          Reps: s.reps || '',
          Weight: s.weight || '',
          Status: s.status,
          Notes: s.notes || '',
        }));
        csvParts.push('SESSIONS\n' + convertToCSV(formattedSessions, headers));
      }
    }

    if (type === 'metrics' || type === 'all') {
      const { data: metrics } = await supabase
        .from('metrics')
        .select('*')
        .eq('client_id', clientId)
        .order('metric_date', { ascending: false });

      if (metrics && metrics.length > 0) {
        const headers = ['Date', 'Type', 'Metric', 'Value', 'Unit', 'Notes'];
        const formattedMetrics = metrics.map((m) => ({
          Date: m.metric_date,
          Type: m.metric_type,
          Metric: m.metric_name,
          Value: m.value,
          Unit: m.unit || '',
          Notes: m.notes || '',
        }));
        csvParts.push('METRICS\n' + convertToCSV(formattedMetrics, headers));
      }
    }

    const csv = csvParts.join('\n\n');
    const filename = `${client.name}_${type || 'data'}_${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
