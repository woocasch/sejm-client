import React from 'react';
import './term-info.scss';
import { TermInfo } from '../services/data-service';

export interface Properties {
  termData: TermInfo;
}

export default function TermInfoComponent(props: Properties) {
  return (
    <div className="term-info">
      <div className="number">{props.termData.num}</div>
      <div className="range">
        <span className="from">{props.termData.from}</span>
        <span className="to">{props.termData.to}</span>
      </div>
    </div>
  );
}
