import React, { useMemo, MouseEvent } from 'react';
import iconNeutral from '../../assets/icons/controls/list/ordering-none.svg';
import iconAscending from '../../assets/icons/controls/list/ordering-asc.svg';
import iconDescending from '../../assets/icons/controls/list/ordering-desc.svg';

export enum OrderingDirection {
  None = 0,
  Ascending = 1,
  Descending = 2,
}

export interface Properties {
  selectedState: OrderingDirection;
  onOrderingChangeRequested: (event: MouseEvent) => void;
}

export default function OrderingIconComponent(props: Properties) {
  const selectedIcon = useMemo(() => {
    switch (props.selectedState) {
      case OrderingDirection.None:
        return iconNeutral;
      case OrderingDirection.Ascending:
        return iconAscending;
      case OrderingDirection.Descending:
        return iconDescending;
    }
  }, [props.selectedState]);

  function onOrderingChangeRequested(event: MouseEvent): void {
    props.onOrderingChangeRequested(event);
  }

  return (
    <img
      src={selectedIcon}
      className="ordering-icon"
      onClick={onOrderingChangeRequested}
    />
  );
}
