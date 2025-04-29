import { IndexedDBCacheManager } from '../services/cache-manager';

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

  constructor(
    private termsCache: IndexedDBCacheManager<TermInfo[]>,
    private membersCache: IndexedDBCacheManager<ParliamentMember[]>,
  ) {}

  public async GetTerms(request: GetTermsRequest): Promise<GetTermsResponse> {
    return await SejmApiClient.RetrieveCached<TermInfo[], GetTermsResponse>(
      this.termsCache,
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
    return await SejmApiClient.RetrieveCached<
      ParliamentMember[],
      GetParliamentMembersResponse
    >(
      this.membersCache,
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

  private static async RetrieveCached<T, TResult>(
    cache: IndexedDBCacheManager<T>,
    key: string,
    apiCall: () => Promise<T>,
    resultFactory: (result: T) => TResult,
  ): Promise<TResult> {
    const cachedItems = await cache.get(key);
    if (!!cachedItems) {
      return resultFactory(cachedItems);
    }

    const result = await apiCall();
    await cache.set(key, result);
    return resultFactory(result);
  }
}

const termsCache = new IndexedDBCacheManager<TermInfo[]>(
  'terms',
  15 * 60 * 1000,
);

const membersCache = new IndexedDBCacheManager<ParliamentMember[]>(
  'members',
  15 * 60 * 1000,
);

export function SejmApiFactory(): ISejmApiClient {
  return new SejmApiClient(termsCache, membersCache);
}
