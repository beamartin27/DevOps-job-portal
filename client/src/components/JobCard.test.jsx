import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobCard from './JobCard';

// Mock the formatters module since it's used by JobCard
jest.mock('../utils/formatters', () => ({
  formatDate: jest.fn((date) => '2 days ago'),
  formatSalary: jest.fn((salary) => '$70k - $90k'),
  getLocationText: jest.fn((job) => 'San Francisco, CA')
}));

describe('JobCard', () => {
  const mockJob = {
    id: 1,
    title: 'React Developer',
    organization: 'Tech Company Inc',
    organization_logo: 'https://example.com/logo.png',
    employment_type: ['full_time'],
    salary_raw: { min: 70000, max: 90000 },
    date_posted: '2024-01-01',
    remote_derived: true,
    location: { city: 'San Francisco', state: 'CA' }
  };

  test('renders job title and company from a mock job', () => {
    const mockOnClick = jest.fn();
    
    render(<JobCard job={mockJob} onClick={mockOnClick} />);
    
    // Check that job title is visible
    expect(screen.getByText('React Developer')).toBeInTheDocument();
    
    // Check that company name is visible
    expect(screen.getByText('Tech Company Inc')).toBeInTheDocument();
    
    // Optionally check for other key elements
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText(/Posted/i)).toBeInTheDocument();
  });
});