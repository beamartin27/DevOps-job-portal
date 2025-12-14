import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  test('calls onSearch when user submits a query', async () => {
    const mockOnSearch = jest.fn();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    // Find the search input field
    const searchInput = screen.getByPlaceholderText('Job title or company');
    
    // Type in the search input
    await userEvent.type(searchInput, 'React Developer');
    
    // Find and click the Search button
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);
    
    // Assert onSearch was called once with the correct parameters
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith({
      search: 'React Developer',
      location: '',
      remote: ''
    });
  });
});