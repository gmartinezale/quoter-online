import FetchService from "@/config/fetch";

export class TypeRepository {
  private _service: any;
  private static _instance: TypeRepository;

  constructor(service: any) {
    this._service = service;
  }

  public static instance(token?: string): TypeRepository {
    return (
      this._instance ?? (this._instance = new this(FetchService._get(token)))
    );
  }

  getTypes(query?: any) {
    return this._service.get(`/admin/types/api/`, query?.options);
  }

  getTypesByProduct(id: string) {
    return this._service.get(`/admin/types/api/${id}`);
  }

  updateType(body: any) {
    return this._service.put(`/admin/types/api`, body);
  }
}
