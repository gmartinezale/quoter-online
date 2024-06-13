import FetchService from "@/config/fetch";

export class QuoterRepository {
  private _service: any;
  private static _instance: QuoterRepository;

  constructor(service: any) {
    this._service = service;
  }

  public static instance(token?: string): QuoterRepository {
    return (
      this._instance ?? (this._instance = new this(FetchService._get(token)))
    );
  }

  saveQuoter(body: any) {
    return this._service.post("/admin/quoter/api", body);
  }
}
