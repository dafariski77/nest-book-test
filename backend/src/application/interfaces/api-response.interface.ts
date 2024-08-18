export class IAPIResponse<T> {
  statusCode: number;
  message: string;
  error?: string;
  data?: T;
}
