import React, { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search, location, remote });
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setRemote('');
    onSearch({ search: '', location: '', remote: '' });
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar__inputs">
        <div className="search-bar__field">
          <Search size={20} className="search-bar__icon" />
          <input
            type="text"
            placeholder="Job title or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar__input"
          />
        </div>

        <div className="search-bar__field">
          <MapPin size={20} className="search-bar__icon" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="search-bar__input"
          />
        </div>

        <div className="search-bar__field">
          <Filter size={20} className="search-bar__icon" />
          <select
            value={remote}
            onChange={(e) => setRemote(e.target.value)}
            className="search-bar__input search-bar__select"
          >
            <option value="">All jobs</option>
            <option value="true">Remote only</option>
            <option value="false">On-site only</option>
          </select>
        </div>
      </div>

      <div className="search-bar__actions">
        <button type="submit" className="search-bar__button search-bar__button--primary">
          Search
        </button>
        <button type="button" onClick={handleReset} className="search-bar__button search-bar__button--secondary">
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

