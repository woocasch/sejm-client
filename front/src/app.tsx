import './app.scss';
import React from 'react';
import { NavLink } from 'react-router';

export default function AppComponent() {
  return (
    <div className="home-page">
      <NavLink to={`/terms`}>Wybierz kadencję</NavLink>
    </div>
  );
}
