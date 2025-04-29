import React, { MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import './term-info.scss';
import { TermInfo } from '../services/data-service.model';
import { NavLink } from 'react-router';

export interface Properties {
  termData: TermInfo;
}

export default function TermInfoComponent(props: Properties) {
  const navigate = useNavigate();

  function termSelected(event: MouseEvent): void {
    navigate(`/terms/${props.termData.num}`);
  }

  return (
    <div className="term-info" onClick={termSelected}>
      <div className="number">{props.termData.num}</div>
      <div className="range">
        <span className="from">{props.termData.from}</span>
        <span className="to">{props.termData.to}</span>
      </div>
    </div>
  );
}
