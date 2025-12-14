import React from 'react';
import { Briefcase } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <Briefcase size={24} />
          <h1 className="header__title">JobPortal</h1>
        </div>
        <nav className="header__nav">
          <a href="#jobs" className="header__link">Jobs</a>
          <a href="#about" className="header__link">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;

