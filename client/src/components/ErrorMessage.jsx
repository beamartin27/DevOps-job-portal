import React from 'react';
import { AlertCircle } from 'lucide-react';
import './ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <AlertCircle size={24} />
      <p className="error-message__text">{message}</p>
    </div>
  );
};

export default ErrorMessage;

