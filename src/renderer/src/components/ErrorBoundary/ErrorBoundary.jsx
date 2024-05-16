import React, { Component } from 'react';
import { Box, Typography } from '@mui/material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Clear all local storage items
    this.clearLocalStorage();

    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <Box sx={{ p: 2 }}>
          <Typography sx={{ color: 'whitesmoke' }}>
            Please clean the cache and restart the application.
          </Typography>
        </Box>
      )
    }

    // When there's no error, render children components normally
    return this.props.children;
  }
}

export default ErrorBoundary;
