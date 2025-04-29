import React, { useEffect, useMemo, useState, MouseEvent } from 'react';
import './term-members.scss';
import { NavLink, useParams } from 'react-router';
import * as DS from '../services/data-service';
import * as DSM from '../services/data-service.model';
import OrderingIconComponent, { OrderingDirection } from './ordering-icon';

export interface RouteParameters {
  termId: string;
}

enum OrderByColumn {
  None,
  Id,
  FullName,
  BirthDate,
  Club,
  District,
  Voivodeship,
}

export default function TermMembersComponent() {
  const dataService: DS.IDataService = DS.DataServiceFactory();

  const params = useParams<keyof RouteParameters>();
  const [members, setMembers] = useState<DSM.ParliamentMember[]>([]);
  const [orderBy, setOrderBy] = useState<OrderByColumn>(OrderByColumn.None);
  const [orderByDirection, setOrderByDirection] = useState<OrderingDirection>(
    OrderingDirection.None,
  );
  const idOrder = createOrderMemo(OrderByColumn.Id);
  const fullNameOrder = createOrderMemo(OrderByColumn.FullName);
  const birthDateOrder = createOrderMemo(OrderByColumn.BirthDate);
  const clubOrder = createOrderMemo(OrderByColumn.Club);
  const districtOrder = createOrderMemo(OrderByColumn.District);
  const voivodeshipOrder = createOrderMemo(OrderByColumn.Voivodeship);

  const orderColumnsMap: Map<
    OrderByColumn,
    (member: DSM.ParliamentMember) => any
  > = new Map<OrderByColumn, (member: DSM.ParliamentMember) => any>([
    [OrderByColumn.Id, (m) => m.id],
    [OrderByColumn.FullName, (m) => m.fullName],
    [OrderByColumn.BirthDate, (m) => m.birthDate],
    [OrderByColumn.Club, (m) => m.club],
    [OrderByColumn.District, (m) => m.districtName],
    [OrderByColumn.Voivodeship, (m) => m.voivodeship],
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
  const orderedMembers = useMemo(() => {
    if (
      orderBy == OrderByColumn.None ||
      orderByDirection == OrderingDirection.None ||
      !propertyRetriever
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
      if (propertyA > propertyB) {
        return isBSmallerResult;
      }

      if (propertyA == propertyB) {
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
    return (event: MouseEvent) => {
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
    };
  }

  return (
    <div className="term-members">
      <h2>Lista posłów {termId()} kadencji</h2>
      <NavLink to={`/terms/${termId()}`}>
        &lt;&lt; Wróć do szczegółów kadencji
      </NavLink>
      <table>
        <thead>
          <tr>
            <td>
              <OrderingIconComponent
                selectedState={idOrder}
                onOrderingChangeRequested={columnOrderChangeRequested(
                  OrderByColumn.Id,
                )}
              />
              ID
            </td>
            <td>
              <OrderingIconComponent
                selectedState={fullNameOrder}
                onOrderingChangeRequested={columnOrderChangeRequested(
                  OrderByColumn.FullName,
                )}
              />
              Nazwisko i imię
            </td>
            <td>
              <OrderingIconComponent
                selectedState={birthDateOrder}
                onOrderingChangeRequested={columnOrderChangeRequested(
                  OrderByColumn.BirthDate,
                )}
              />
              Data urodzenia
            </td>
            <td>
              <OrderingIconComponent
                selectedState={clubOrder}
                onOrderingChangeRequested={columnOrderChangeRequested(
                  OrderByColumn.Club,
                )}
              />
              Klub
            </td>
            <td>
              <OrderingIconComponent
                selectedState={districtOrder}
                onOrderingChangeRequested={columnOrderChangeRequested(
                  OrderByColumn.District,
                )}
              />
              Okręg
            </td>
            <td>
              <OrderingIconComponent
                selectedState={voivodeshipOrder}
                onOrderingChangeRequested={columnOrderChangeRequested(
                  OrderByColumn.Voivodeship,
                )}
              />
              Województwo
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
              <td>{member.id}</td>
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
