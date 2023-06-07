import { UserModel } from '../dao/models/user.model.js';

export class UserService {
   validateUser(firstName, lastName, email) {
      if (!firstName || !lastName || !email) {
         throw new Error('Error, please enter a valid first name, last name and email!');
      }
   }

   async getUsers() {
      const users = await UserModel.find({});
      return users;
   }

   async createUser(firstName, lastName, email) {
      this.validateUser(firstName, lastName, email);
      const user = await UserModel.create({ firstName, lastName, email });
      return user;
   }

   async updateUser(id, firstName, lastName, email) {
      if (!id) throw new Error('Error, please enter a valid user id!');
      this.validateUser(firstName, lastName, email);
      const user = await UserModel.updateOne({ _id: id }, { firstName, lastName, email });
      return user;
   }

   async deleteUser(id) {
      if (!id) throw new Error('Error, please enter a valid id!');
      const foundUser = await UserModel.find({ _id: id });
      if (!foundUser) {
         throw new Error('User not found');
      }
      const deletedUser = await UserModel.deleteOne({ _id: id });
      return `User ${id} was successfully deleted!`;
   }
}
