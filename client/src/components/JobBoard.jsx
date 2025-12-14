import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from './Header';
import SearchBar from './SearchBar';
import JobCard from './JobCard';
import JobDetail from './JobDetail';
import Pagination from './Pagination';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { fetchJobs } from '../services/api';
import './JobBoard.css';

const JobBoard = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    remote: '',
    page: 1,
    limit: 10
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
  });

  const handleSearch = (searchFilters) => {
    setFilters({ ...filters, ...searchFilters, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="job-board">
      <Header />
      
      <main className="job-board__content">
        <SearchBar onSearch={handleSearch} />
        
        {isLoading && <Loading />}
        
        {error && <ErrorMessage message="Failed to load jobs. Please try again." />}
        
        {data && (
          <>
            <div className="job-board__results">
              <div className="job-board__list">
              <div className="job-board__count" aria-live="polite">
                  {data.pagination.total} jobs found
              </div>
                {data.data.length === 0 ? (
                  <div className="job-board__empty">
                    No jobs found matching your criteria.
                  </div>
                ) : (
                  data.data.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={() => setSelectedJob(job)}
                      isActive={selectedJob?.id === job.id}
                    />
                  ))
                )}
              </div>
              
              {selectedJob && (
                <div className="job-board__detail">
                  <JobDetail 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)}
                  />
                </div>
              )}
            </div>
            
            {data.pagination.pages > 1 && (
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default JobBoard;

