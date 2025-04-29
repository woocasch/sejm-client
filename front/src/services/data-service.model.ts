export interface GetTermsRequest {}

export interface TermInfo {
  num: number;
  from: string;
  to: string;
}

export interface GetTermsResponse {
  terms: TermInfo[];
}
