import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Layout from './Layout';
import { jest } from '@jest/globals';
import { describe, it, expect } from '@jest/globals';


jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));


describe('Layout', () => {
  const renderWithI18n = (component: React.ReactElement) => {
    return render(
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    );
  };

  it('renders children and sidebar', () => {
    renderWithI18n(
      <Layout>
        <div data-testid="child-element">Child Content</div>
      </Layout>
    );

    expect(screen.getByTestId('child-element')).toBeTruthy();
    expect(screen.getByText('inventoryManagement')).toBeTruthy();
  });

  it('renders theme toggle button', () => {
    renderWithI18n(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeTruthy();
  });

  it('renders global search', () => {
    renderWithI18n(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByRole('textbox')).toBeTruthy();
  });
});