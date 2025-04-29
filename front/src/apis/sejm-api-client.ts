import { ICacheManager, CacheManagerFactory } from '../services/cache-manager';

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

export interface ISejmApiClient {
  GetTerms(request: GetTermsRequest): Promise<GetTermsResponse>;

  GetParliamentMembers(
    request: GetParliamentMembersRequest,
  ): Promise<GetParliamentMembersResponse>;
}

export class SejmApiClient implements ISejmApiClient {
  private readonly rootAddress: string = 'https://api.sejm.gov.pl/sejm/term';

  constructor(private cache: ICacheManager) {}

  public async GetTerms(request: GetTermsRequest): Promise<GetTermsResponse> {
    return await this.RetrieveCached<TermInfo[], GetTermsResponse>(
      this.cache.TermsStoreName,
      'ALL',
      async () => {
        const response = await fetch(this.rootAddress);
        const json = await response.json();
        return <TermInfo[]>json;
      },
      (v) => {
        return { terms: v };
      },
    );
  }

  public async GetParliamentMembers(
    request: GetParliamentMembersRequest,
  ): Promise<GetParliamentMembersResponse> {
    return await this.RetrieveCached<
      ParliamentMember[],
      GetParliamentMembersResponse
    >(
      this.cache.MembersStoreName,
      'ALL',
      async () => {
        const address = `${this.rootAddress}${request.termId}/MP`;
        const response = await fetch(address);
        const json = await response.json();
        return <ParliamentMember[]>json;
      },
      (v) => <GetParliamentMembersResponse>{ members: v },
    );
  }

  private async RetrieveCached<T, TResult>(
    storeName: string,
    key: string,
    apiCall: () => Promise<T>,
    resultFactory: (result: T) => TResult,
  ): Promise<TResult> {
    const cachedItems = await this.cache.get<T>(storeName, key);
    if (!!cachedItems) {
      return resultFactory(cachedItems);
    }

    const result = await apiCall();
    await this.cache.set(storeName, key, result);
    return resultFactory(result);
  }
}

export function SejmApiFactory(): ISejmApiClient {
  return new SejmApiClient(CacheManagerFactory());
}
