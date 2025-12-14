import React from 'react';
import { MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';
import { formatDate, formatSalary, getLocationText } from '../utils/formatters';
import './JobCard.css';

const JobCard = ({ job, onClick, isActive }) => {
  const location = getLocationText(job);
  const salary = formatSalary(job.salary_raw);
  const postedDate = formatDate(job.date_posted);

  return (
    <article 
      className={`job-card ${isActive ? 'job-card--active' : ''}`}
      onClick={onClick}
    >
      <div className="job-card__header">
        {job.organization_logo && (
          <img 
            src={job.organization_logo} 
            alt={job.organization}
            className="job-card__logo"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
        <div className="job-card__header-text">
          <h3 className="job-card__title">{job.title}</h3>
          <p className="job-card__company">{job.organization}</p>
        </div>
      </div>

      <div className="job-card__details">
        <div className="job-card__detail">
          <MapPin size={16} />
          <span>{location}</span>
        </div>

        {job.employment_type && job.employment_type[0] && (
          <div className="job-card__detail">
            <Briefcase size={16} />
            <span>{job.employment_type[0].replace('_', ' ')}</span>
          </div>
        )}

        {salary && (
          <div className="job-card__detail">
            <DollarSign size={16} />
            <span>{salary}</span>
          </div>
        )}
      </div>

      <div className="job-card__footer">
        <div className="job-card__date">
          <Calendar size={14} />
          <span>Posted {postedDate}</span>
        </div>
        
        {job.remote_derived && (
          <span className="job-card__badge job-card__badge--remote">Remote</span>
        )}
      </div>
    </article>
  );
};

export default JobCard;

