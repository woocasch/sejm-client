import * as API from '../apis/sejm-api-client';
import * as Model from './data-service.model';

export class DataServiceMappers {
  public static MapTermToTermsListItem(input: API.TermInfo): Model.TermInfo {
    return <Model.TermInfo>{
      num: input.num || 0,
      from: input.from || '',
      to: input.to || '',
    };
  }
}
