export interface GetTermsRequest {
}

export interface TermPrintsData {
  count?: number;
  lastChanged?: Date;
  link?: string;
}

export interface TermInfo {
  num?: number;
  from?: string;
  to?: string;
  current?: boolean;
  prints?: TermPrintsData;
}

export interface GetTermsResponse {
  terms?: TermInfo[];
}

export interface ISejmApiClient {
  GetTerms(request: GetTermsRequest): Promise<GetTermsResponse>;
}

export class SejmApiClient implements ISejmApiClient {
  GetTerms(request: GetTermsRequest): Promise<GetTermsResponse> {
    return fetch('https://api.sejm.gov.pl/sejm/term')
      .then((response) => response.json())
      .then(json => <GetTermsResponse>{ terms: <TermInfo>json });
  }
}

export function SejmApiFactory(): ISejmApiClient {
  return new SejmApiClient();
}
