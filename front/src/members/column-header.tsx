import React, { MouseEvent } from 'react';

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
}

export default function ColumnHeaderComponent(props: Properties) {
  function onOrderChangeRequested(_mouseEvent: MouseEvent) {
    props.columnOrderChangeRequest(props.column);
  }

  return (
    <div>
      <OrderingIconComponent
        selectedState={props.columnDirection}
        onOrderingChangeRequested={onOrderChangeRequested}
      />
      <span onClick={onOrderChangeRequested}>{props.header}</span>
    </div>
  );
}
