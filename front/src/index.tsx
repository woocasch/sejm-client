import React from 'react';
import ReactDOM from 'react-dom/client';
import AppComponent from './app';
import './assets/reset.scss';
import './assets/index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router';
import TermsComponent from './terms/terms';
import { IndexedDBCacheManager } from './services/cache-manager';
import { TermInfo } from './services/data-service';

const router = createBrowserRouter([
  {
    path: '/',
    Component: AppComponent,
  },
  {
    path: '/terms',
    Component: TermsComponent,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <div className="root_container">
    <div className="menu">
      <a href="/">Start</a>
    </div>
    <div className="content">
      <RouterProvider router={router} />
    </div>
    <div className="footer">© Łukasz Nowakowski</div>
  </div>,
);

const cache = new IndexedDBCacheManager<TermInfo>('terms', 15 * 60 * 1000);
// You can also clean expired data manually if you want
setInterval(
  () => {
    cache.cleanupExpired();
  },
  5 * 60 * 1000,
); // clean every 5 minutes
