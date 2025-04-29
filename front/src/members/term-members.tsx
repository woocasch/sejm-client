import React, { useEffect, useMemo, useState } from 'react';
import './term-members.scss';
import { NavLink, useParams } from 'react-router';
import * as DS from '../services/data-service';
import * as DSM from '../services/data-service.model';
import OrderingIconComponent, { OrderingDirection } from './ordering-icon';

export default function TermMembersComponent() {
  const dataService: DS.IDataService = DS.DataServiceFactory();

  const params = useParams();
  const [members, setMembers] = useState<DSM.ParliamentMember[]>([]);
  const [idOrder, setIdOrder] = useState<OrderingDirection>(
    OrderingDirection.None,
  );
  const [fullNameOrder, setFullNameOrder] = useState<OrderingDirection>(
    OrderingDirection.None,
  );
  const [birthDateOrder, setBirthDateOrder] = useState<OrderingDirection>(
    OrderingDirection.None,
  );
  const [clubOrder, setClubOrder] = useState<OrderingDirection>(
    OrderingDirection.None,
  );
  const [districtOrder, setDistrictOrder] = useState<OrderingDirection>(
    OrderingDirection.None,
  );
  const [voivodeshipOrder, setVoivodeshipOrder] = useState<OrderingDirection>(
    OrderingDirection.None,
  );

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
              <OrderingIconComponent selectedState={idOrder} />
              ID
            </td>
            <td>
              <OrderingIconComponent selectedState={fullNameOrder} />
              Nazwisko i imię
            </td>
            <td>
              <OrderingIconComponent selectedState={birthDateOrder} />
              Data urodzenia
            </td>
            <td>
              <OrderingIconComponent selectedState={clubOrder} />
              Klub
            </td>
            <td>
              <OrderingIconComponent selectedState={districtOrder} />
              Okręg
            </td>
            <td>
              <OrderingIconComponent selectedState={voivodeshipOrder} />
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
