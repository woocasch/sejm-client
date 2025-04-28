export interface GetTermsRequest { }

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

export interface ISejmApiClient {
  GetTerms(request: GetTermsRequest): Promise<GetTermsResponse>;

  GetParliamentMembers(request: GetParliamentMembersRequest): Promise<GetParliamentMembersResponse>;
}

export class SejmApiClient implements ISejmApiClient {
  private readonly rootAddress: string = 'https://api.sejm.gov.pl/sejm/term'

  public async GetTerms(request: GetTermsRequest): Promise<GetTermsResponse> {
    const response = await fetch(this.rootAddress);
    const json = await response.json();
    const terms = <TermInfo[]>json;
    return {
      terms: terms,
    };
  }

  public async GetParliamentMembers(request: GetParliamentMembersRequest): Promise<GetParliamentMembersResponse> {
    const address = `${this.rootAddress}${request.termId}/MP`;
    const response = await fetch(address);
    const json = await response.json();
    const members = <ParliamentMember[]>json;
    return {
      members: members,
    }
  }
}

export function SejmApiFactory(): ISejmApiClient {
  return new SejmApiClient();
}
