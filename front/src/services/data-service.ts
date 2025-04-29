import * as API from '../apis/sejm-api-client';
import * as Model from './data-service.model';
import { DataServiceMappers as Mapper } from './data-service-mappers';

export interface IDataService {
  GetTerms(request: Model.GetTermsRequest): Promise<Model.GetTermsResponse>;
  GetMembers(
    request: Model.GetMembersRequest,
  ): Promise<Model.GetMembersResponse>;
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

  public async GetMembers(
    request: Model.GetMembersRequest,
  ): Promise<Model.GetMembersResponse> {
    const retrieved = await this.api
      .GetParliamentMembers({ termId: request.termId })
      .then((result) => {
        if (!result.members) {
          return [];
        }

        var output: Model.ParliamentMember[] = result.members.map(
          Mapper.MapMemberToListItem,
        );
        return output;
      });
    return {
      members: retrieved,
    };
  }
}

export function DataServiceFactory(): IDataService {
  return new DataService(API.SejmApiFactory());
}
