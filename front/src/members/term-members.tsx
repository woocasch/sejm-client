import React, {
  useEffect,
  useMemo,
  useState,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import './term-members.scss';
import { NavLink, useParams } from 'react-router';
import * as DS from '../services/data-service';
import * as DSM from '../services/data-service.model';
import { OrderingDirection } from '../controls/list/ordering-icon';
import ListComponent from '../controls/list/list';

export interface RouteParameters {
  termId: string;
}

export enum OrderByColumn {
  None,
  FullName,
  BirthDate,
  Club,
  District,
  Voivodeship,
}

export default function TermMembersComponent() {
  const dataService: DS.IDataService = DS.DataServiceFactory();

  const params = useParams<keyof RouteParameters>();

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

  const [members, setMembers] = useState<DSM.ParliamentMember[]>([]);
  const [displayMembers, setDisplayMembers] = useState<DSM.ParliamentMember[]>(
    [],
  );
  const [orderBy, setOrderBy] = useState<OrderByColumn>(OrderByColumn.None);
  const [orderByDirection, setOrderByDirection] = useState<OrderingDirection>(
    OrderingDirection.None,
  );
  const fullNameOrder = createOrderMemo(OrderByColumn.FullName);
  const birthDateOrder = createOrderMemo(OrderByColumn.BirthDate);
  const clubOrder = createOrderMemo(OrderByColumn.Club);
  const districtOrder = createOrderMemo(OrderByColumn.District);
  const voivodeshipOrder = createOrderMemo(OrderByColumn.Voivodeship);

  const [fullNameFilter, setFullNameFilter] = useState<string>('');
  const [birthDateFilter, setBirthDateFilter] = useState<string>('');
  const [clubFilter, setClubFilter] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [voivodeshipFilter, setVoivodeshipFilter] = useState<string>('');

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

  const columnFiltersSetters: Map<
    OrderByColumn,
    Dispatch<SetStateAction<string>>
  > = new Map<OrderByColumn, Dispatch<SetStateAction<string>>>([
    [OrderByColumn.FullName, setFullNameFilter],
    [OrderByColumn.BirthDate, setBirthDateFilter],
    [OrderByColumn.Club, setClubFilter],
    [OrderByColumn.District, setDistrictFilter],
    [OrderByColumn.Voivodeship, setVoivodeshipFilter],
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

  function applyFilter(
    data: DSM.ParliamentMember[],
    filterValue: string,
    propertyGetter: (m: DSM.ParliamentMember) => string,
  ) {
    if (!!filterValue) {
      data = data.filter((m) => {
        const property = propertyGetter(m).toLocaleLowerCase();
        return property.indexOf(filterValue.toLocaleLowerCase()) >= 0;
      });
    }

    return data;
  }

  function filterData(): DSM.ParliamentMember[] {
    let processedList = members.slice();
    processedList = applyFilter(
      processedList,
      fullNameFilter,
      (m) => m.fullName,
    );
    processedList = applyFilter(
      processedList,
      birthDateFilter,
      (m) => m.birthDate,
    );
    processedList = applyFilter(processedList, clubFilter, (m) => m.club);
    processedList = applyFilter(
      processedList,
      districtFilter,
      (m) => m.districtName,
    );
    processedList = applyFilter(
      processedList,
      voivodeshipFilter,
      (m) => m.voivodeship,
    );
    if (
      orderBy != OrderByColumn.None &&
      orderByDirection != OrderingDirection.None &&
      !!propertyRetriever &&
      !!propertyComparer
    ) {
      processedList = processedList.sort((a, b) => {
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
    }

    return processedList;
  }

  useEffect(() => {
    const data = filterData();
    setDisplayMembers(data);
  }, [
    members,
    fullNameFilter,
    birthDateFilter,
    clubFilter,
    districtFilter,
    voivodeshipFilter,
    orderBy,
    orderByDirection,
  ]);

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
  }, []);

  return (
    <div className="term-members">
      <h2>Lista posłów {termId()} kadencji</h2>
      <div>FullNameFilter: {fullNameFilter}</div>
      <div>members.length: {members.length}</div>
      <NavLink to={`/terms/${termId()}`}>
        &lt;&lt; Wróć do szczegółów kadencji
      </NavLink>
      <ListComponent<DSM.ParliamentMember, OrderByColumn>
        allItems={members}
        columns={[
          {
            columnName: OrderByColumn.FullName,
            header: 'Imię i nazwisko',
            sortDirection: fullNameOrder,
            valueFactory: (item) => item.fullName,
            filterText: fullNameFilter,
            setFilterText: (v) => setFullNameFilter(v),
            sortingComparer: (a: string, b: string) => a.localeCompare(b),
          },
          {
            columnName: OrderByColumn.BirthDate,
            header: 'Data urodzenia',
            sortDirection: birthDateOrder,
            valueFactory: (item) => item.birthDate,
            filterText: birthDateFilter,
            setFilterText: (v) => setBirthDateFilter(v),
            sortingComparer: (a: string, b: string) => a.localeCompare(b),
            columnStyle: { width: '10%' },
          },
          {
            columnName: OrderByColumn.Club,
            header: 'Klub',
            sortDirection: clubOrder,
            valueFactory: (item) => item.club,
            filterText: clubFilter,
            setFilterText: (v) => setClubFilter(v),
            sortingComparer: (a: string, b: string) => a.localeCompare(b),
            columnStyle: { width: '20%' },
          },
          {
            columnName: OrderByColumn.District,
            header: 'Okręg',
            sortDirection: districtOrder,
            valueFactory: (item) =>
              `${item.districtName} (${item.districtNumber})`,
            filterText: districtFilter,
            setFilterText: (v) => setDistrictFilter(v),
            sortValueFactory: (item) => item.districtName,
            sortingComparer: (a: string, b: string) => a.localeCompare(b),
            columnStyle: { width: '15%' },
          },
          {
            columnName: OrderByColumn.Voivodeship,
            header: 'Województwo',
            sortDirection: voivodeshipOrder,
            valueFactory: (item) => item.voivodeship,
            filterText: voivodeshipFilter,
            setFilterText: (v) => setVoivodeshipFilter(v),
            sortingComparer: (a: string, b: string) => a.localeCompare(b),
            columnStyle: { width: '15%' },
          },
        ]}
        orderBy={orderBy}
        setOrderBy={(v: OrderByColumn) => setOrderBy(v)}
        orderByDirection={orderByDirection}
        setOrderByDirection={(v: OrderingDirection) => setOrderByDirection(v)}
      />
    </div>
  );
}
