import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import * as DS from '../services/data-service';
import * as DSM from '../services/data-service.model';

export default function TermMembersComponent() {
  const dataService: DS.IDataService = DS.DataServiceFactory();

  const params = useParams();
  const [members, setMembers] = useState<DSM.ParliamentMember[]>([]);

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
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Nazwisko i imię</td>
            <td>Data urodzenia</td>
            <td>Klub</td>
            <td>Okręg</td>
            <td>Województwo</td>
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
