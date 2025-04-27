import React from 'react';
import ReactDOM from 'react-dom/client';
import AppComponent from './app';
import './assets/reset.scss';
import './assets/index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    Component: AppComponent,
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
    <RouterProvider router={router} />
    <div className="footer">© Łukasz Nowakowski</div>
  </div>,
);
