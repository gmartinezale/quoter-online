import FetchService from "@/config/fetch";
import { Quoter } from "@/entities/Quoter";

interface GetQuotersResponse {
  success: boolean;
  quotersPending: Quoter[];
  quotersProcess: Quoter[];
}

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

  getQuoters(query?: any): Promise<GetQuotersResponse> {
    return this._service.get("/admin/quoter/api", query?.options);
  }
}
