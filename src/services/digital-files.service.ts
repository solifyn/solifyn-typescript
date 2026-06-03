import { BaseService } from './base';

export interface DigitalFileInput {
  name: string;
  url: string;
  size: number;
  type: string;
}

export class DigitalFilesService extends BaseService {
  async create(data: DigitalFileInput): Promise<any> {
    return this.request<any>('POST', '/digital-files', data);
  }

  async list(): Promise<any[]> {
    return this.request<any[]>('GET', '/digital-files');
  }

  async delete(id: string): Promise<any> {
    return this.request<any>('DELETE', `/digital-files/${id}`);
  }
}
