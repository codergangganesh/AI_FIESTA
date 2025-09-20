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

describe('ApiCallHistoryChart - Modern Graph', () => {
  const mockData = [
    { period: 'Comparison 1', value: 10 },
    { period: 'Comparison 2', value: 25 },
    { period: 'Comparison 3', value: 15 },
    { period: 'Comparison 4', value: 30 },
    { period: 'Comparison 5', value: 20 },
    { period: 'Comparison 6', value: 35 },
    { period: 'Comparison 7', value: 18 },
    { period: 'Comparison 8', value: 22 }
  ];

  it('renders modern graph with 8 items by default', () => {
    render(
      <DarkModeProvider>
        <ApiCallHistoryChart data={mockData} title="API Calls History" unit=" calls" />
      </DarkModeProvider>
    );

    expect(screen.getByText('API Calls History')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByText('Recent API Usage')).toBeInTheDocument();
    
    // Check that total usage is displayed
    const totalValue = mockData.reduce((sum, item) => sum + item.value, 0);
    expect(screen.getByText(`${totalValue} calls total`)).toBeInTheDocument();
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