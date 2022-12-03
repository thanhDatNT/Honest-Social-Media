import { IUser } from './user';

export interface IAuthenticationResponse {
  user: IUser;
  accessToken: string | '';
  refreshToken: string | '';
}
