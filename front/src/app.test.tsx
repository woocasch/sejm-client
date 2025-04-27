import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppComponent from './App';

describe('AppComponent', () => {
  it('should be rendered', () => {
    render(
      <AppComponent />,
    );
  });
});
