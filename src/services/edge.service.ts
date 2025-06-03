import { axiosWithAuth } from '../api/interceptiors';

export interface EdgeDto {
  id: string;
  source: string;
  target: string;
}

export const EdgeService = {
  async getAll(): Promise<EdgeDto[]> {
    const { data } = await axiosWithAuth.get<EdgeDto[]>('/edges');
    return data;
  },

  async create(edge: EdgeDto): Promise<EdgeDto> {
    const { data } = await axiosWithAuth.post<EdgeDto>('/edges', edge);
    return data;
  },

  async delete(id: string): Promise<void> {
    await axiosWithAuth.delete(`/edges/${id}`);
  },
};
