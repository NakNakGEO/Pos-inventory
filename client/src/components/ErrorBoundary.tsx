import React, { ErrorInfo, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // You can log the error to an error reporting service here
  }

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>{t('errorBoundary.title')}</h1>
          <p>{t('errorBoundary.message')}</p>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            {t('errorBoundary.refresh')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
