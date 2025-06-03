export interface IAuthForm {
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface IUser {
  id: number;
  name?: string;
  email: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: IUser;
}
