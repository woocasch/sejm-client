import React from 'react';
import ReactDOM from 'react-dom/client';
import AppComponent from './app';
import './assets/reset.scss';
import './assets/index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router';
import TermsComponent from './terms/terms';
import { CacheManagerFactory } from './services/cache-manager';
import TermDetailsComponent from './terms/term-details';
import TermMembersComponent from './members/term-members';

const router = createBrowserRouter([
  {
    path: '/',
    Component: AppComponent,
  },
  {
    path: '/terms',
    Component: TermsComponent,
  },
  {
    path: '/terms/:termId',
    Component: TermDetailsComponent,
  },
  {
    path: '/terms/:termId/members',
    Component: TermMembersComponent,
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

const cache = CacheManagerFactory();
// You can also clean expired data manually if you want
setInterval(
  () => {
    cache.cleanupExpired();
  },
  5 * 60 * 1000,
); // clean every 5 minutes
