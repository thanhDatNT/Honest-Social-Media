import { IPost } from './post';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  dob: string;
  email: string;
  avatar?: string;
  cover?: string;
  gender: number;
  phoneNo: string;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
  relationship?: number;
}
export interface IUserHub {
  Avatar: string;
  Cover: string;
  CreatedAt: string;
  Dob: string;
  Email: string;
  FirstName: string;
  Gender: number;
  Id: number;
  LastName: string;
  PhoneNo: string;
  UpdatedAt: string;
  UserName: string;
}

export enum Gender {
  MALE,
  FEMALE,
  OTHER
}

export interface ISearchUser {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  avatar: string;
  relationship: number;
}

export interface ISearchUserResponse {
  users: ISearchUser[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface ISearchFriend {
  id?: number;
  firstName: string;
  lastName: string;
  userName: string;
  avatar: string;
}

export interface ISearchFriendResponse {
  friends: ISearchFriend[];
  totalCount: number;
  hasNextPage: boolean;
}
export interface IUserCommented {
  id: number;
  user: IUser;
  content: string;
  createdAt: Date;
  post: IPost;
}
