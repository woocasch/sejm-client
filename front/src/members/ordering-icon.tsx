import React, { useMemo } from 'react';
import iconNeutral from '../assets/icons/members/ordering-none.svg';
import iconAscending from '../assets/icons/members/ordering-asc.svg';
import iconDescending from '../assets/icons/members/ordering-desc.svg';

export enum OrderingDirection {
  None = 0,
  Ascending = 1,
  Descending = 2,
}

export interface Properties {
  selectedState: OrderingDirection;
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
  return <img src={selectedIcon} className="ordering-icon" />;
}
