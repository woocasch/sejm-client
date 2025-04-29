export interface GetTermsRequest {}

export interface TermInfo {
  num: number;
  from: string;
  to: string;
}

export interface GetTermsResponse {
  terms: TermInfo[];
}

export interface GetMembersRequest {
  termId: number;
}

export interface ParliamentMember {
  id: number;
  fullName: string;
  birthDate: string;
  isActive: boolean;
  club: string;
  districtName: string;
  districtNumber: number;
  voivodeship: string;
}

export interface GetMembersResponse {
  members: ParliamentMember[];
}
