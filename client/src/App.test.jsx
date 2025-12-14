import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the API service to prevent real network calls
jest.mock('./services/api', () => ({
  fetchJobs: jest.fn(() => Promise.resolve({
    data: [],
    pagination: { total: 0, page: 1, pages: 1 }
  }))
}));

describe('App', () => {
  test('renders without crashing and shows main heading', () => {
    render(<App />);
    
    // Check that the main heading "JobPortal" appears
    expect(screen.getByText('JobPortal')).toBeInTheDocument();
    
    // Check that "Jobs" link appears in navigation
    expect(screen.getByText('Jobs')).toBeInTheDocument();
  });
});