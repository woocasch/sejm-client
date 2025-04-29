import * as API from '../apis/sejm-api-client';
import * as Model from './data-service.model';
import { DataServiceMappers as Mapper } from './data-service-mappers';

export interface IDataService {
  GetTerms(request: Model.GetTermsRequest): Promise<Model.GetTermsResponse>;
}

export class DataService implements IDataService {
  constructor(private api: API.ISejmApiClient) {}
  public async GetTerms(
    request: Model.GetTermsRequest,
  ): Promise<Model.GetTermsResponse> {
    const retrieved = await this.api.GetTerms({}).then((result) => {
      if (!result.terms) {
        return [];
      }
      var output: Model.TermInfo[] = result.terms.map(
        Mapper.MapTermToTermsListItem,
      );
      return output;
    });
    return {
      terms: retrieved,
    };
  }
}

export function DataServiceFactory(): IDataService {
  return new DataService(API.SejmApiFactory());
}
