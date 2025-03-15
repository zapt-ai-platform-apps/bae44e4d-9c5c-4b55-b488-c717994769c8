import React from 'react';
import AppRoutes from './app/routes';
import Layout from './modules/layout/components/Layout';
import AppProviders from './app/AppProviders';

export default function App() {
  return (
    <AppProviders>
      <Layout>
        <AppRoutes />
      </Layout>
    </AppProviders>
  );
}