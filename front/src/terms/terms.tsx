import React, { useEffect, useMemo, useState } from 'react';
import './terms.scss';
import * as API from '../services/sejm-api-client';
import TermInfoComponent from './term-info';

export interface Properties {}

export default function TermsComponent(props: Properties) {
  const apiClient: API.ISejmApiClient = API.SejmApiFactory();

  const [terms, setTerms] = useState<API.TermInfo[]>([]);

  const termsOrdered = useMemo(() => {
    return terms.sort((a, b) => a.num - b.num);
  }, [terms]);

  useEffect(() => {
    const request: API.GetTermsRequest = {
      resultCallback: (v) => setTerms(v),
    };
    apiClient.GetTerms(request);
  }, []);

  return (
    <div className="terms">
      {termsOrdered.map((term, i) => (
        <TermInfoComponent key={i} termData={term} />
      ))}
    </div>
  );
}
