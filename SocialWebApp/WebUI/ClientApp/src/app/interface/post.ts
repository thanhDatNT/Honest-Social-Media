import { IUser, IUserCommented } from './user';

export interface IPost {
  id: number;
  status?: string;
  photos?: IPostPhoto[];
  numberOfLikes: number;
  numberOfComments: number;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
  postLikes: IPostLike[];
  comments: IUserCommented[];
}

export interface IPostResponse {
  items: IPost[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface IPostLike {
  id?: number;
  userId: number;
  postId: number;
}

export interface IPostPhoto {
  id: number;
  postId: number;
  photo: string;
}
export enum LikeStatus {
  LIKE,
  UNLIKE
}
