import React, { useEffect, CSSProperties, useState } from 'react';
import { OrderingDirection } from './ordering-icon';
import ColumnHeaderComponent from './column-header';

export interface ColumnDefinition<TItem, TColumns> {
  columnName: TColumns;
  sortDirection: OrderingDirection;
  header: string;
  valueFactory: (item: TItem) => string;
  filterText: string;
  setFilterText: (v: string) => void;
  sortValueFactory?: (item: TItem) => any;
  sortingComparer?: (a: any, b: any) => number;
  columnStyle?: CSSProperties;
}

export interface Properties<TItem, TColumns> {
  allItems: TItem[];
  columns: ColumnDefinition<TItem, TColumns>[];
  orderBy: TColumns;
  setOrderBy: (v: TColumns) => void;
  orderByDirection: OrderingDirection;
  setOrderByDirection: (v: OrderingDirection) => void;
}

export default function TermMembersComponent<TItem, TColumns>(
  props: Properties<TItem, TColumns>,
) {
  const [displayMembers, setDisplayMembers] = useState<TItem[]>([]);

  function applyFilter(
    data: TItem[],
    filterValue: string,
    propertyGetter: (m: TItem) => string,
  ) {
    if (!!filterValue) {
      data = data.filter((m) => {
        const property = propertyGetter(m).toLocaleLowerCase();
        return property.indexOf(filterValue.toLocaleLowerCase()) >= 0;
      });
    }

    return data;
  }

  function filterData(): TItem[] {
    let processedList = props.allItems.slice();
    for (let i = 0; i < props.columns.length; i++) {
      const currentColumn = props.columns[i];
      processedList = applyFilter(
        processedList,
        currentColumn.filterText,
        currentColumn.valueFactory,
      );
    }
    if (!!props.orderBy && props.orderByDirection != OrderingDirection.None) {
      const columnIndex = props.columns.findIndex(
        (v) => v.columnName == props.orderBy,
      );
      if (columnIndex != -1) {
        const columnInfo = props.columns[columnIndex];
        const propertyReader: (t: TItem) => any = !!columnInfo.sortValueFactory
          ? columnInfo.sortValueFactory
          : columnInfo.valueFactory;
        let comparer: (a: any, b: any) => number = (a, b) => a - b;
        if (!!columnInfo.sortingComparer) {
          comparer = columnInfo.sortingComparer;
        }
        const isBLargerResult =
          props.orderByDirection == OrderingDirection.Ascending ? 1 : -1;
        const isBSmallerResult =
          props.orderByDirection == OrderingDirection.Ascending ? -1 : 1;
        processedList = processedList.sort((a, b) => {
          const propertyA = propertyReader(a);
          const propertyB = propertyReader(b);
          const rawResult = comparer(propertyA, propertyB);
          if (rawResult < 0) {
            return isBSmallerResult;
          }

          if (rawResult == 0) {
            return 0;
          }

          return isBLargerResult;
        });
      }
    }

    return processedList;
  }

  useEffect(() => {
    const data = filterData();
    setDisplayMembers(data);
  }, [props.allItems, props.columns, props.orderBy, props.orderByDirection]);

  function columnOrderChangeRequested(column: TColumns) {
    const columnIndex = props.columns.findIndex((v) => v.columnName == column);
    if (columnIndex == -1) {
      return;
    }

    const columnInfo = props.columns[columnIndex];
    if (column == props.orderBy) {
      const newDirection =
        props.orderByDirection != OrderingDirection.Ascending
          ? OrderingDirection.Ascending
          : OrderingDirection.Descending;
      props.setOrderByDirection(newDirection);
      return;
    }

    props.setOrderBy(column);
    props.setOrderByDirection(OrderingDirection.Ascending);
  }

  function onFilterChanged(column: TColumns, filterText: string) {
    const columnIndex = props.columns.findIndex((v) => v.columnName == column);
    if (columnIndex == -1) {
      return;
    }

    const filterSetter = props.columns[columnIndex].setFilterText;
    if (!filterSetter) {
      return;
    }

    filterSetter(filterText);
  }

  return (
    <table>
      <colgroup>
        {props.columns.map((item, i) => (
          <col key={i} style={item.columnStyle} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {props.columns.map((item, i) => (
            <td key={i}>
              <ColumnHeaderComponent<TColumns>
                column={item.columnName}
                columnDirection={item.sortDirection}
                header={item.header}
                columnOrderChangeRequest={columnOrderChangeRequested}
                filterChanged={onFilterChanged}
              />
            </td>
          ))}
        </tr>
      </thead>
      <tfoot>
        <tr>
          <td colSpan={props.columns.length}>&nbsp;</td>
        </tr>
      </tfoot>
      <tbody>
        {displayMembers.map((item, i) => (
          <tr key={i}>
            {props.columns.map((column, j) => (
              <td key={`${i}_${j}`}>{column.valueFactory(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
