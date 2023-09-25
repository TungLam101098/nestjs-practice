import { User } from '@interfaces';

class UserDTO {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;

  constructor(user: User) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.isAdmin = user.isAdmin;
  }
}

export default UserDTO;
