export const formatDate = (dateString) => {
  if (!dateString) return 'Recently';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatSalary = (salaryRaw) => {
  if (!salaryRaw || !salaryRaw.value) return null;
  
  const { currency, value } = salaryRaw;
  const { minValue, maxValue, unitText } = value;
  
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  if (minValue && maxValue) {
    return `${formatAmount(minValue)} - ${formatAmount(maxValue)}${unitText ? `/${unitText.toLowerCase()}` : ''}`;
  }
  
  if (minValue) {
    return `${formatAmount(minValue)}+${unitText ? `/${unitText.toLowerCase()}` : ''}`;
  }
  
  return null;
};

export const getLocationText = (job) => {
  if (job.remote_derived) {
    return 'Remote';
  }
  
  if (job.locations_derived && job.locations_derived.length > 0) {
    return job.locations_derived[0];
  }
  
  if (job.locations_alt_raw && job.locations_alt_raw.length > 0) {
    return job.locations_alt_raw[0];
  }
  
  if (job.locations_raw && job.locations_raw.length > 0) {
    const location = job.locations_raw[0];
    if (location.address) {
      const parts = [
        location.address.addressLocality,
        location.address.addressRegion,
        location.address.addressCountry
      ].filter(Boolean);
      return parts.join(', ') || 'Location not specified';
    }
  }
  
  return 'Location not specified';
};

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

