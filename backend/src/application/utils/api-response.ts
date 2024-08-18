export class ApiResponse {
  static success<T>(message: string, data?: T, statusCode: number = 200) {
    return {
      message,
      data,
      statusCode,
    };
  }

  static error(message: string, errors: any = null, statusCode: number = 400) {
    return {
      message,
      errors,
      statusCode,
    };
  }
}
