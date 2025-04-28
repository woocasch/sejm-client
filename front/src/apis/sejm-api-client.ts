export interface GetTermsRequest {}

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
  public async GetTerms(request: GetTermsRequest): Promise<GetTermsResponse> {
    const response = await fetch('https://api.sejm.gov.pl/sejm/term');
    const json = await response.json();
    const terms = <TermInfo[]>json;
    return {
      terms: terms,
    };
  }
}

export function SejmApiFactory(): ISejmApiClient {
  return new SejmApiClient();
}
