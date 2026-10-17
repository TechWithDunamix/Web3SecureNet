import { Component, type ErrorInfo, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Page rendering failed:', error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return (
        <main role="alert" className="min-h-screen bg-[#0a0a1f] text-white flex items-center justify-center p-6">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold">This page could not be loaded</h1>
            <p>Please reload the page and try again.</p>
            <button onClick={() => window.location.reload()} className="bg-purple-600 px-4 py-2 rounded-lg">Reload page</button>
            <a href="/login" className="block text-purple-300">Back to sign in</a>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
