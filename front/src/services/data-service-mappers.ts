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

  public static MapMemberToListItem(
    input: API.ParliamentMember,
  ): Model.ParliamentMember {
    return <Model.ParliamentMember>{
      id: input.id,
      fullName: input.lastFirstName,
      birthDate: input.birthDate,
      isActive: input.active,
      club: input.club,
      districtName: input.districtName,
      districtNumber: input.districtNum,
      voivodeship: input.voivodeship,
    };
  }
}
