// interfaces
export interface LoginData {
  username: string;
  password: string;
}
export interface RegisterData extends LoginData {
  email: string;
}

// type aliases
export type UserData<T extends boolean> = T extends true
  ? RegisterData
  : LoginData;
