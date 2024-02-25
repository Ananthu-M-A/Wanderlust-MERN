import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppContextProvider } from './contexts/AppContext.tsx';
import { SearchContextProvider } from './contexts/SearchContext.tsx';
import { AdminContextProvider } from './contexts/AdminContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <AdminContextProvider>
          <SearchContextProvider>
            <App />
          </SearchContextProvider>
        </AdminContextProvider>
      </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
