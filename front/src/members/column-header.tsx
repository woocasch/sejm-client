import React, { ChangeEvent, MouseEvent } from 'react';
import './column-header.scss';

import OrderingIconComponent, { OrderingDirection } from './ordering-icon';

export enum OrderByColumn {
  None,
  FullName,
  BirthDate,
  Club,
  District,
  Voivodeship,
}

export interface Properties {
  columnDirection: OrderingDirection;
  column: OrderByColumn;
  header: string;
  columnOrderChangeRequest: (column: OrderByColumn) => void;
  filterChanged: (column: OrderByColumn, filterText: string) => void;
}

export default function ColumnHeaderComponent(props: Properties) {
  function onOrderChangeRequested(_mouseEvent: MouseEvent) {
    props.columnOrderChangeRequest(props.column);
  }

  function onControlBlur(event: any): void {
    props.filterChanged(props.column, event.target!.value);
  }

  return (
    <div className="column-header">
      <div className="title">
        <OrderingIconComponent
          selectedState={props.columnDirection}
          onOrderingChangeRequested={onOrderChangeRequested}
        />
        <span onClick={onOrderChangeRequested}>{props.header}</span>
      </div>
      <div className="filter">
        <input type="text" onBlur={onControlBlur} />
      </div>
    </div>
  );
}
