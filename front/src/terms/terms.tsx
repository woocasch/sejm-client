import React, { useEffect, useMemo, useState } from 'react';
import './terms.scss';
import * as DTS from '../services/data-service';
import TermInfoComponent from './term-info';

export interface Properties {}

export default function TermsComponent(props: Properties) {
  const apiClient: DTS.IDataService = DTS.DataServiceFactory();

  const [terms, setTerms] = useState<DTS.TermInfo[]>([]);

  const termsOrdered = useMemo(() => {
    return terms.sort((a, b) => b.num - a.num);
  }, [terms]);

  useEffect(() => {
    const fetch = async () => {
      const request: DTS.GetTermsRequest = {};
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
