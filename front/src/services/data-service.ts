import * as API from '../apis/sejm-api-client';
import { IndexedDBCacheManager } from './cache-manager';

export interface GetTermsRequest {}

export interface TermInfo {
  num: number;
  from: string;
  to: string;
}

export interface GetTermsResponse {
  terms: TermInfo[];
}

export interface IDataService {
  GetTerms(request: GetTermsRequest): Promise<GetTermsResponse>;
}

export class DataService implements IDataService {
  constructor(
    private api: API.ISejmApiClient,
    private cache: IndexedDBCacheManager<TermInfo[]>,
  ) {}
  public async GetTerms(request: GetTermsRequest): Promise<GetTermsResponse> {
    const cachedTerms = await this.cache.get('ALL');
    if (!!cachedTerms) {
      return {
        terms: cachedTerms,
      };
    }

    const retrieved = await this.api.GetTerms({}).then((result) => {
      var output: TermInfo[] = [];
      if (!!result && !!result.terms) {
        result.terms.forEach((term) => {
          output.push(<TermInfo>{
            num: term.num || 0,
            from: term.from || '',
            to: term.to || '',
          });
        });
      }

      return output;
    });

    await this.cache.set('ALL', retrieved);
    return {
      terms: retrieved,
    };
  }
}

const termsCache = new IndexedDBCacheManager<TermInfo[]>(
  'terms',
  15 * 60 * 1000,
);

export function DataServiceFactory(): IDataService {
  return new DataService(API.SejmApiFactory(), termsCache);
}
