import React from 'react';
import { render, screen } from '@testing-library/react';
import ApiCallHistoryChart from './ApiCallHistoryChart';
import { DarkModeProvider } from '@/contexts/DarkModeContext';

// Mock the recharts components
jest.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ children }: any) => <div data-testid="bar">{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Cell: () => <div data-testid="cell" />
}));

describe('ApiCallHistoryChart', () => {
  const mockData = [
    { period: 'Comparison 1', value: 10 },
    { period: 'Comparison 2', value: 25 },
    { period: 'Comparison 3', value: 15 },
    { period: 'Comparison 4', value: 30 },
    { period: 'Comparison 5', value: 20 }
  ];

  it('renders correctly with data', () => {
    render(
      <DarkModeProvider>
        <ApiCallHistoryChart data={mockData} title="API Calls History" unit=" calls" />
      </DarkModeProvider>
    );

    expect(screen.getByText('API Calls History')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    
    // Check that summary cards are rendered
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    render(
      <DarkModeProvider>
        <ApiCallHistoryChart data={[]} title="API Calls History" unit=" calls" isLoading={true} />
      </DarkModeProvider>
    );

    expect(screen.getByText('API Calls History')).toBeInTheDocument();
    // Check for loading skeleton elements
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    render(
      <DarkModeProvider>
        <ApiCallHistoryChart data={[]} title="API Calls History" unit=" calls" />
      </DarkModeProvider>
    );

    expect(screen.getByText('API Calls History')).toBeInTheDocument();
    expect(screen.getByText('No data available. Start making API calls to see chart data.')).toBeInTheDocument();
  });
});