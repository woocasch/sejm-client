import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router';
import * as DS from '../services/data-service';
import * as DSM from '../services/data-service.model';

export default function TermDetailsComponent() {
  const dataService: DS.IDataService = DS.DataServiceFactory();

  const params = useParams();

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

  return (
    <div className="term-details">
      <p>Szczegóły kadencji</p>
      <p>Kadencja: {termId()}</p>
      <p>
        <NavLink to={`/terms/${termId()}/members`}>Lista posłów</NavLink>
      </p>
    </div>
  );
}
