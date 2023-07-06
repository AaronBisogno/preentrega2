import { UserModel } from '../dao/models/user.model.js';

export class UserService {
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

    async createUser(user) {
        const newUser = await UserModel.create(user);
        return newUser;
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
