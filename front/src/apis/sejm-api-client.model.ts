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

export interface GetParliamentMembersRequest {
  termId: number;
}

export interface ParliamentMember {
  accusativeName: string;
  active: boolean;
  birthDate: string;
  birthLocation: string;
  club: string;
  districtName: string;
  districtNum: number;
  educationLevel: string;
  email: string;
  firstLastName: string;
  firstName: string;
  genitiveName: string;
  id: number;
  lastFirstName: string;
  lastName: string;
  numberOfVotes: number;
  profession: string;
  secondName: string;
  voivodeship: string;
}

export interface GetParliamentMembersResponse {
  members: ParliamentMember[];
}
