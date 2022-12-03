import { IMessage, IMessageHub } from '../interface/message';
import { IUser, IUserHub } from '../interface/user';

export const messageHubParser = (message: IMessageHub): IMessage => ({
  content: message.Content,
  createdAt: message.CreatedAt,
  id: message.Id,
  isRead: message.IsRead,
  type: message.Type,
  receiver: userHubParser(message.Receiver),
  receiverId: message.ReceiverId,
  sender: userHubParser(message.Sender),
  senderId: message.SenderId
});
export const userHubParser = (receiver: IUserHub): IUser => ({
  avatar: receiver.Avatar,
  cover: receiver.Cover,
  createdAt: receiver.CreatedAt,
  dob: receiver.Dob,
  email: receiver.Email,
  firstName: receiver.FirstName,
  gender: receiver.Gender,
  id: receiver.Id,
  lastName: receiver.LastName,
  phoneNo: receiver.PhoneNo,
  updatedAt: receiver.UpdatedAt,
  userName: receiver.UserName
});
