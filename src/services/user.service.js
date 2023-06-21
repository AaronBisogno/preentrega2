import { UserModel } from '../dao/models/user.model.js';

export class UserService {
   validateUser(firstName, lastName, email, age, password) {
      if (!firstName || !lastName || !email || !password || !age) {
         throw new Error('Error, please enter a valid first name, last name and email!');
      }
   }

   calculateAge(dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
         age--;
      }
      return age;
   }

   async getUsers() {
      const users = await UserModel.find({});
      return users;
   }

   async loginUser(email, pass){
      const user = await UserModel.findOne({email})
      if (user && user.password === pass){
         return 'user logged successfully!'
      } else return 'invalid user'
   }

   async createUser(firstName, lastName, email, age, password) {
      this.validateUser(firstName, lastName, email, age, password);
      const user = await UserModel.create({ firstName, lastName, email, age, password });
      return user;
   }

   async deleteUser(id) {
      if (!id) throw new Error('Error, please enter a valid id!');
      const foundUser = await UserModel.find({ _id: id });
      if (!foundUser) {
         throw new Error('User not found');
      }
      await UserModel.deleteOne({ _id: id });
      return `User ${id} was successfully deleted!`;
   }
}
