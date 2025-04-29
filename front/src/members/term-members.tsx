import React, { useEffect, useMemo, useState, MouseEvent } from 'react';
import './term-members.scss';
import { NavLink, useParams } from 'react-router';
import * as DS from '../services/data-service';
import * as DSM from '../services/data-service.model';
import OrderingIconComponent, { OrderingDirection } from './ordering-icon';
import ColumnHeaderComponent, { OrderByColumn } from './column-header';

export interface RouteParameters {
  termId: string;
}

export default function TermMembersComponent() {
  const dataService: DS.IDataService = DS.DataServiceFactory();

  const params = useParams<keyof RouteParameters>();
  const [members, setMembers] = useState<DSM.ParliamentMember[]>([]);
  const [orderBy, setOrderBy] = useState<OrderByColumn>(OrderByColumn.None);
  const [orderByDirection, setOrderByDirection] = useState<OrderingDirection>(
    OrderingDirection.None,
  );
  const fullNameOrder = createOrderMemo(OrderByColumn.FullName);
  const birthDateOrder = createOrderMemo(OrderByColumn.BirthDate);
  const clubOrder = createOrderMemo(OrderByColumn.Club);
  const districtOrder = createOrderMemo(OrderByColumn.District);
  const voivodeshipOrder = createOrderMemo(OrderByColumn.Voivodeship);

  const orderColumnsMap: Map<
    OrderByColumn,
    (member: DSM.ParliamentMember) => any
  > = new Map<OrderByColumn, (member: DSM.ParliamentMember) => any>([
    [OrderByColumn.FullName, (m) => m.fullName],
    [OrderByColumn.BirthDate, (m) => m.birthDate],
    [OrderByColumn.Club, (m) => m.club],
    [OrderByColumn.District, (m) => m.districtName],
    [OrderByColumn.Voivodeship, (m) => m.voivodeship],
  ]);

  const orderColumnsComparerMap: Map<
    OrderByColumn,
    (a: any, b: any) => number
  > = new Map<OrderByColumn, (a: any, b: any) => number>([
    [OrderByColumn.FullName, (a: string, b: string) => a.localeCompare(b)],
    [OrderByColumn.BirthDate, (a: string, b: string) => a.localeCompare(b)],
    [OrderByColumn.Club, (a: string, b: string) => a.localeCompare(b)],
    [OrderByColumn.District, (a: string, b: string) => a.localeCompare(b)],
    [OrderByColumn.Voivodeship, (a: string, b: string) => a.localeCompare(b)],
  ]);

  const propertyRetriever:
    | ((member: DSM.ParliamentMember) => any)
    | null
    | undefined = useMemo(() => {
    if (!orderBy) {
      return null;
    }

    return orderColumnsMap.get(orderBy);
  }, [orderBy]);

  const propertyComparer: ((a: any, b: any) => number) | null | undefined =
    useMemo(() => {
      if (!orderBy) {
        return null;
      }

      return orderColumnsComparerMap.get(orderBy);
    }, [orderBy]);

  const orderedMembers = useMemo(() => {
    if (
      orderBy == OrderByColumn.None ||
      orderByDirection == OrderingDirection.None ||
      !propertyRetriever ||
      !propertyComparer
    ) {
      return members;
    }

    return members.sort((a, b) => {
      const propertyA = propertyRetriever(a);
      const propertyB = propertyRetriever(b);
      const isBLargerResult =
        orderByDirection == OrderingDirection.Ascending ? 1 : -1;
      const isBSmallerResult =
        orderByDirection == OrderingDirection.Ascending ? -1 : 1;
      const rawResult = propertyComparer(propertyA, propertyB);
      if (rawResult < 0) {
        return isBSmallerResult;
      }

      if (rawResult == 0) {
        return 0;
      }

      return isBLargerResult;
    });
  }, [members, orderBy, orderByDirection]);

  function termId() {
    if (!params || !params.termId) {
      return -1;
    }

    const parsed = parseInt(params.termId);
    if (isNaN(parsed)) {
      return -1;
    }

    return parsed;
  }

  function createOrderMemo(column: OrderByColumn): OrderingDirection {
    return useMemo<OrderingDirection>(() => {
      if (orderBy != column) {
        return OrderingDirection.None;
      }

      return orderByDirection;
    }, [orderBy, orderByDirection]);
  }

  useEffect(() => {
    if (termId() <= 0) {
      return;
    }

    const fetch = async () => {
      const response = await dataService.GetMembers({ termId: termId() });
      setMembers(response.members);
    };

    fetch().catch(console.error);
  });

  function columnOrderChangeRequested(column: OrderByColumn) {
    if (column == orderBy) {
      const newDirection =
        orderByDirection != OrderingDirection.Ascending
          ? OrderingDirection.Ascending
          : OrderingDirection.Descending;
      setOrderByDirection(newDirection);
      return;
    }

    setOrderBy(column);
    setOrderByDirection(OrderingDirection.Ascending);
  }

  return (
    <div className="term-members">
      <h2>Lista posłów {termId()} kadencji</h2>
      <div>Kolumna: {orderBy}</div>
      <div>Kierunek: {orderByDirection}</div>
      <NavLink to={`/terms/${termId()}`}>
        &lt;&lt; Wróć do szczegółów kadencji
      </NavLink>
      <table>
        <thead>
          <tr>
            <td>
              <ColumnHeaderComponent
                column={OrderByColumn.FullName}
                columnDirection={fullNameOrder}
                header="Nazwisko i imię"
                columnOrderChangeRequest={columnOrderChangeRequested}
              />
            </td>
            <td>
              <ColumnHeaderComponent
                column={OrderByColumn.BirthDate}
                columnDirection={birthDateOrder}
                header="Data urodzenia"
                columnOrderChangeRequest={columnOrderChangeRequested}
              />
            </td>
            <td>
              <ColumnHeaderComponent
                column={OrderByColumn.Club}
                columnDirection={clubOrder}
                header="Klub"
                columnOrderChangeRequest={columnOrderChangeRequested}
              />
            </td>
            <td>
              <ColumnHeaderComponent
                column={OrderByColumn.District}
                columnDirection={districtOrder}
                header="Okręg"
                columnOrderChangeRequest={columnOrderChangeRequested}
              />
            </td>
            <td>
              <ColumnHeaderComponent
                column={OrderByColumn.Voivodeship}
                columnDirection={voivodeshipOrder}
                header="Województwo"
                columnOrderChangeRequest={columnOrderChangeRequested}
              />
            </td>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td colSpan={6}>&nbsp;</td>
          </tr>
        </tfoot>
        <tbody>
          {members.map((member, i) => (
            <tr key={i}>
              <td>{member.fullName}</td>
              <td>{member.birthDate}</td>
              <td>{member.club}</td>
              <td>
                {member.districtName} ({member.districtNumber})
              </td>
              <td>{member.voivodeship}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
