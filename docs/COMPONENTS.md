# Component Reference Guide

Complete reference for all React components in the Job Portal.

---

## Table of Contents

1. [Header](#header)
2. [SearchBar](#searchbar)
3. [JobCard](#jobcard)
4. [JobDetail](#jobdetail)
5. [JobBoard](#jobboard)
6. [Pagination](#pagination)
7. [Loading](#loading)
8. [ErrorMessage](#errormessage)

---

## Header

### Purpose
Global site header with logo and navigation.

### Location
`client/src/components/Header.jsx`

### Props
None - Static component

### Usage
```jsx
import Header from './components/Header';

<Header />
```

### Features
- Displays logo and site name
- Navigation links (Jobs, About)
- Sticky positioning
- Responsive design

### Styling
`client/src/components/Header.css`

---

## SearchBar

### Purpose
Search and filter interface for jobs.

### Location
`client/src/components/SearchBar.jsx`

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onSearch | function | Yes | Callback when search is submitted |

### Callback Parameters
```javascript
onSearch({
  search: string,    // Search query
  location: string,  // Location filter
  remote: string     // Remote filter ("true", "false", or "")
})
```

### Usage
```jsx
import SearchBar from './components/SearchBar';

const handleSearch = (filters) => {
  console.log(filters);
  // { search: "engineer", location: "NY", remote: "true" }
};

<SearchBar onSearch={handleSearch} />
```

### Features
- Search by keyword
- Location filter
- Remote/on-site dropdown
- Reset button
- Form validation

### Internal State
- `search` - Search input value
- `location` - Location input value
- `remote` - Remote filter value

### Styling
`client/src/components/SearchBar.css`

---

## JobCard

### Purpose
Displays job listing in a card format.

### Location
`client/src/components/JobCard.jsx`

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| job | object | Yes | Job data object |
| onClick | function | No | Callback when card is clicked |
| isActive | boolean | No | Whether card is currently selected |

### Job Object Structure
```javascript
{
  id: string,
  title: string,
  organization: string,
  organization_logo: string | null,
  date_posted: string,
  locations_derived: string[],
  locations_raw: object[],
  salary_raw: object | null,
  employment_type: string[],
  remote_derived: boolean
}
```

### Usage
```jsx
import JobCard from './components/JobCard';

<JobCard 
  job={jobData}
  onClick={() => handleJobClick(jobData)}
  isActive={selectedJob?.id === jobData.id}
/>
```

### Features
- Company logo display
- Job title and company
- Location badge
- Employment type
- Salary display (if available)
- Posted date (relative format)
- Remote badge
- Hover effects
- Active state styling

### Dependencies
- `utils/formatters.js` - Date, salary, location formatting
- `lucide-react` - Icons

### Styling
`client/src/components/JobCard.css`

---

## JobDetail

### Purpose
Displays complete job information.

### Location
`client/src/components/JobDetail.jsx`

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| job | object | Yes | Job data object |
| onClose | function | Yes | Callback to close detail view |

### Job Object Structure
Same as JobCard (see above) plus:
```javascript
{
  ...jobCardProps,
  description_text: string,
  url: string,
  organization_url: string | null
}
```

### Usage
```jsx
import JobDetail from './components/JobDetail';

<JobDetail 
  job={selectedJob}
  onClose={() => setSelectedJob(null)}
/>
```

### Features
- Close button
- Large company logo
- Full job description
- All meta information
- Company website link
- Apply button (external link)
- Scrollable content
- Mobile full-screen modal

### Dependencies
- `utils/formatters.js` - Formatting functions
- `lucide-react` - Icons

### Styling
`client/src/components/JobDetail.css`

### Responsive Behavior
- **Desktop**: Side panel with sticky position
- **Mobile**: Full-screen modal with slide-up animation

---

## JobBoard

### Purpose
Main container managing job list and detail view.

### Location
`client/src/components/JobBoard.jsx`

### Props
None - Root component

### Usage
```jsx
import JobBoard from './components/JobBoard';

<JobBoard />
```

### Internal State
```javascript
{
  selectedJob: object | null,
  filters: {
    search: string,
    location: string,
    remote: string,
    page: number,
    limit: number
  }
}
```

### Features
- Manages search filters
- Fetches and displays jobs
- Handles job selection
- Pagination control
- Loading states
- Error handling
- Responsive layout

### Child Components
- Header
- SearchBar
- JobCard (multiple)
- JobDetail (conditional)
- Pagination
- Loading (conditional)
- ErrorMessage (conditional)

### API Integration
Uses React Query to fetch jobs with filters.

### Styling
`client/src/components/JobBoard.css`

---

## Pagination

### Purpose
Page navigation controls.

### Location
`client/src/components/Pagination.jsx`

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| currentPage | number | Yes | Current page number |
| totalPages | number | Yes | Total number of pages |
| onPageChange | function | Yes | Callback when page changes |

### Usage
```jsx
import Pagination from './components/Pagination';

<Pagination
  currentPage={2}
  totalPages={10}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

### Features
- Previous/Next buttons
- Page number buttons (max 5 visible)
- Active page highlighting
- Disabled state for edges
- Smart page calculation
- Scroll to top on change

### Logic
Shows up to 5 page numbers centered around current page.

Example:
- Current: 1 → Show: 1 2 3 4 5
- Current: 5 → Show: 3 4 5 6 7
- Current: 10 (of 10) → Show: 6 7 8 9 10

### Dependencies
- `lucide-react` - Arrow icons

### Styling
`client/src/components/Pagination.css`

---

## Loading

### Purpose
Loading state indicator.

### Location
`client/src/components/Loading.jsx`

### Props
None

### Usage
```jsx
import Loading from './components/Loading';

{isLoading && <Loading />}
```

### Features
- Animated spinner
- Loading text
- Centered layout
- Maintains layout stability

### Animation
CSS keyframe rotation (360deg infinite)

### Styling
`client/src/components/Loading.css`

---

## ErrorMessage

### Purpose
Error state display.

### Location
`client/src/components/ErrorMessage.jsx`

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| message | string | Yes | Error message to display |

### Usage
```jsx
import ErrorMessage from './components/ErrorMessage';

{error && (
  <ErrorMessage message="Failed to load jobs. Please try again." />
)}
```

### Features
- Alert icon
- Custom error message
- Error styling (red theme)
- Accessible alert role

### Dependencies
- `lucide-react` - AlertCircle icon

### Styling
`client/src/components/ErrorMessage.css`

---

## Component Interactions

```
JobBoard
  ↓ renders
Header, SearchBar, JobCard[], JobDetail, Pagination

JobBoard
  ↓ passes filters to
API (via React Query)
  ↓ returns
Job data
  ↓ renders in
JobCard components
  ↓ onClick
JobBoard updates selectedJob
  ↓ renders
JobDetail with selected job
```

---

## Common Patterns

### Event Handler Pattern
```jsx
const handleClick = () => {
  // Handle click
};

<Component onClick={handleClick} />
```

### Conditional Rendering
```jsx
{condition && <Component />}
{condition ? <ComponentA /> : <ComponentB />}
```

### Prop Spreading
```jsx
const props = { prop1, prop2, prop3 };
<Component {...props} />
```

### Default Props
```jsx
const Component = ({ prop = defaultValue }) => {
  // Component logic
};
```

---

## Styling Conventions

### Class Naming (BEM-like)
```css
.component { }
.component__element { }
.component__element--modifier { }
```

### Example
```css
.job-card { }
.job-card__title { }
.job-card__title--active { }
```

### Responsive Classes
```css
@media (max-width: 640px) {
  .component--mobile { }
}
```

---

## Performance Tips

### Memoization
```jsx
import React, { memo } from 'react';

const Component = memo(({ prop }) => {
  return <div>{prop}</div>;
});
```

### useCallback
```jsx
import { useCallback } from 'react';

const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### useMemo
```jsx
import { useMemo } from 'react';

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(prop);
}, [prop]);
```

---

## Testing Components

### Basic Test Structure
```jsx
import { render, screen } from '@testing-library/react';
import Component from './Component';

test('renders component', () => {
  render(<Component />);
  const element = screen.getByText(/text/i);
  expect(element).toBeInTheDocument();
});
```

### Testing with Props
```jsx
test('handles click', () => {
  const handleClick = jest.fn();
  render(<Component onClick={handleClick} />);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

## Accessibility

### Required Attributes
- `alt` for images
- `aria-label` for icon buttons
- `role` for custom elements
- Semantic HTML elements

### Example
```jsx
<button
  onClick={handleClick}
  aria-label="Close modal"
  type="button"
>
  <Icon />
</button>
```

---

## Component File Structure

```
Component.jsx          ← React component
Component.css          ← Component styles
Component.test.jsx     ← Unit tests (optional)
index.js               ← Export barrel (optional)
```

---

## Import Order Convention

```jsx
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 3. Icons
import { Search, MapPin } from 'lucide-react';

// 4. Internal components
import Header from './Header';
import JobCard from './JobCard';

// 5. Services
import { fetchJobs } from '../services/api';

// 6. Utils
import { formatDate } from '../utils/formatters';

// 7. Styles
import './Component.css';
```

---

## Quick Reference Table

| Component | Lines | Props | State | API | Responsive |
|-----------|-------|-------|-------|-----|------------|
| Header | ~30 | 0 | No | No | Yes |
| SearchBar | ~70 | 1 | Yes | No | Yes |
| JobCard | ~80 | 3 | No | No | Yes |
| JobDetail | ~120 | 2 | No | No | Yes |
| JobBoard | ~100 | 0 | Yes | Yes | Yes |
| Pagination | ~60 | 3 | No | No | Yes |
| Loading | ~15 | 0 | No | No | Yes |
| ErrorMessage | ~20 | 1 | No | No | Yes |

---

## Future Component Ideas

- **FilterPanel** - Advanced filtering options
- **JobSaveButton** - Bookmark/save jobs
- **ShareButton** - Share job listings
- **ApplicationTracker** - Track applications
- **UserProfile** - User information
- **CompanyCard** - Company information
- **SkillBadge** - Display required skills
- **SalaryChart** - Visualize salary ranges

---

This component reference provides everything you need to understand, use, and extend the Job Portal components!

