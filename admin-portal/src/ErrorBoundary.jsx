import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-red-50 border border-red-100 rounded-3xl text-center">
          <h2 className="text-xl font-black text-red-600">Something went wrong in this section.</h2>
          <p className="text-slate-500 mt-2">Try refreshing the page or check the console for details.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold"
          >
            Refresh App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;