declare namespace Express {
  interface Request {
    file?: {
      path: string;
      filename: string;
      [key: string]: any;
    };
  }
}
