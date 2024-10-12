import React from 'react';
import { render, screen } from '../utils/testUtils';
import Layout from './Layout';

describe('Layout', () => {
  it('renders children and sidebar', () => {
    render(
      <Layout>
        <div data-testid="child-element">Child Content</div>
      </Layout>
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Inventory MS')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('renders global search', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
});