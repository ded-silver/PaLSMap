import { axiosWithAuth } from '../api/interceptiors';
import { IUser } from '../types/auth.types';

export interface IProfileResponse {
  user: IUser;
}

class UserService {
  private BASE_URL = '/user/profile';

  async getProfile() {
    const response = await axiosWithAuth.get<IProfileResponse>(this.BASE_URL);
    return response.data;
  }
}

export const userService = new UserService();
