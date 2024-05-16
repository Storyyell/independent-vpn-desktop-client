import { Box, Typography } from '@mui/material';
import React, { Component } from 'react';

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
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{p:2}}>
        <Typography sx={{
          color: 'white',
        }}>
          Please clean the cache and restart the application
        </Typography>
        </Box>
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
