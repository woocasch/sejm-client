import { ICacheManager, CacheManagerFactory } from '../services/cache-manager';
import * as Model from './sejm-api-client.model';

export interface ISejmApiClient {
  GetTerms(request: Model.GetTermsRequest): Promise<Model.GetTermsResponse>;

  GetParliamentMembers(
    request: Model.GetParliamentMembersRequest,
  ): Promise<Model.GetParliamentMembersResponse>;
}

export class SejmApiClient implements ISejmApiClient {
  private readonly rootAddress: string = 'https://api.sejm.gov.pl/sejm/term';

  constructor(private cache: ICacheManager) { }

  public async GetTerms(request: Model.GetTermsRequest): Promise<Model.GetTermsResponse> {
    return await this.RetrieveCached<Model.TermInfo[], Model.GetTermsResponse>(
      this.cache.TermsStoreName,
      'ALL',
      async () => {
        const response = await fetch(this.rootAddress);
        const json = await response.json();
        return <Model.TermInfo[]>json;
      },
      (v) => {
        return { terms: v };
      },
    );
  }

  public async GetParliamentMembers(
    request: Model.GetParliamentMembersRequest,
  ): Promise<Model.GetParliamentMembersResponse> {
    return await this.RetrieveCached<
      Model.ParliamentMember[],
      Model.GetParliamentMembersResponse
    >(
      this.cache.MembersStoreName,
      'ALL',
      async () => {
        const address = `${this.rootAddress}${request.termId}/MP`;
        const response = await fetch(address);
        const json = await response.json();
        return <Model.ParliamentMember[]>json;
      },
      (v) => <Model.GetParliamentMembersResponse>{ members: v },
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
