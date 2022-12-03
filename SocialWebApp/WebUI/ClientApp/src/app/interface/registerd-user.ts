export interface IRegisterUser {
  id?: number;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  dob: string;
  email: string;
  gender: number;
  phoneNo: string;
  createdAt?: string;
  updatedAt?: string;
}
