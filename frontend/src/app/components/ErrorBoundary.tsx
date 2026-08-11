import { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught Error Boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-glass-mesh flex items-center justify-center p-6 text-left">
          <div className="glass-modal max-w-md w-full p-8 rounded-3xl space-y-5 text-center shadow-2xl border border-slate-700/60 bg-[#0f172a]/95">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <AlertCircle size={36} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Application Notice
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 font-mono text-left overflow-x-auto">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </p>
            </div>

            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/home';
              }}
              className="glass-btn glass-btn-primary w-full py-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <RefreshCw size={15} /> Reload & Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
