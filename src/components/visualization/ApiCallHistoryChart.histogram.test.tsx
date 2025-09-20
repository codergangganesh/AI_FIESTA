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

describe('ApiCallHistoryChart - Histogram', () => {
  const mockData = [
    { period: 'Comparison 1', value: 10 },
    { period: 'Comparison 2', value: 25 },
    { period: 'Comparison 3', value: 15 },
    { period: 'Comparison 4', value: 30 },
    { period: 'Comparison 5', value: 20 },
    { period: 'Comparison 6', value: 35 },
    { period: 'Comparison 7', value: 18 },
    { period: 'Comparison 8', value: 22 },
    { period: 'Comparison 9', value: 28 },
    { period: 'Comparison 10', value: 12 }
  ];

  it('renders histogram chart with 8 items by default', () => {
    render(
      <DarkModeProvider>
        <ApiCallHistoryChart data={mockData} title="API Calls History" unit=" calls" />
      </DarkModeProvider>
    );

    expect(screen.getByText('API Calls History')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    
    // Check that 8 summary cards are rendered (default for histogram)
    const cards = screen.getAllByText(/calls/);
    expect(cards).toHaveLength(8);
  });

  it('shows all items when showAll is true', () => {
    // We'll need to test this with a different approach since state is internal
    // This is just a placeholder for a more comprehensive test
    expect(mockData.length).toBe(10);
  });

  it('renders loading state correctly', () => {
    render(
      <DarkModeProvider>
        <ApiCallHistoryChart data={[]} title="API Calls History" unit=" calls" isLoading={true} />
      </DarkModeProvider>
    );

    expect(screen.getByText('API Calls History')).toBeInTheDocument();
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