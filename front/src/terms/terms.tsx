import React, { useEffect, useMemo, useState } from 'react';
import './terms.scss';
import * as DS from '../services/data-service';
import * as DSM from '../services/data-service.model';
import TermInfoComponent from './term-info';

export interface Properties {}

export default function TermsComponent(props: Properties) {
  const apiClient: DS.IDataService = DS.DataServiceFactory();

  const [terms, setTerms] = useState<DSM.TermInfo[]>([]);

  const termsOrdered = useMemo(() => {
    return terms.sort((a, b) => b.num - a.num);
  }, [terms]);

  useEffect(() => {
    const fetch = async () => {
      const request: DSM.GetTermsRequest = {};
      const result = await apiClient.GetTerms(request);
      if (!!result && !!result.terms) setTerms(result.terms);
    };

    fetch().catch(console.error);
  }, []);

  return (
    <div className="terms">
      {termsOrdered.map((term, i) => (
        <TermInfoComponent key={i} termData={term} />
      ))}
    </div>
  );
}
