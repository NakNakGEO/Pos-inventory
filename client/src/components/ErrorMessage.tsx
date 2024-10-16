import React from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
  error: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  const { t } = useTranslation();

  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong className="font-bold">{t('error.title')}: </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );
};

export default ErrorMessage;