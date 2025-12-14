import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import JobBoard from './components/JobBoard';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <JobBoard />
      </div>
    </QueryClientProvider>
  );
}

export default App;

