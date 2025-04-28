import * as API from '../apis/sejm-api-client';

export interface GetTermsRequest {
  resultCallback: (terms: TermInfo[]) => void;
}

export interface TermInfo {
  num: number;
  from: string;
  to: string;
}

export interface IDataService {
  GetTerms(request: GetTermsRequest): void;
}

export class DataService implements IDataService {
  constructor(private api: API.ISejmApiClient) {}
  GetTerms(request: GetTermsRequest): void {
    this.api.GetTerms({}).then((result) => {
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

      request.resultCallback(output);
    });
  }
}

export function DataServiceFactory(): IDataService {
  return new DataService(API.SejmApiFactory());
}
