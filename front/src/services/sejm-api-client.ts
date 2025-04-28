export interface GetTermsRequest {
  resultCallback: (terms: TermInfo[]) => void;
}

export interface TermPrintsData {
  count: number;
  lastChanged: Date;
  link: string;
}

export interface TermInfo {
  num: number;
  from: string;
  to: string;
  current: boolean;
  prints: TermPrintsData;
}

export interface ISejmApiClient {
  GetTerms(request: GetTermsRequest): void;
}

export class SejmApiClient implements ISejmApiClient {
  GetTerms(request: GetTermsRequest): void {
    fetch('https://api.sejm.gov.pl/sejm/term')
      .then((response) => response.json())
      .then((data) => request.resultCallback(data));
  }
}

export function SejmApiFactory(): ISejmApiClient {
  return new SejmApiClient();
}
