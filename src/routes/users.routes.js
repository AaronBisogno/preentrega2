import { Router } from 'express';
import { UserModel } from '../dao/models/user.model.js';
import { UserService } from '../services/user.service.js';

export const usersRouter = Router();

const userService = new UserService();

usersRouter.get('/', async (req, res) => {
   try {
      const users = await userService.getUsers();
      return res.status(200).json({
         status: 'success',
         msg: 'Users list',
         data: users,
      });
   } catch (e) {
      return res.status(500).json({
         status: 'error',
         msg: 'Something went wrong!'
      });
   }
});

usersRouter.post('/', async (req, res) => {
   const { firstName, lastName, email } = req.body;
   try {
      const user = await userService.createUser(firstName, lastName, email);
      return res.status(201).json({
         status: 'success',
         msg: 'User created!',
         data: user,
      });
   } catch (e) {
      console.log(e);
      return res.status(500).json({
         status: 'error',
         msg: 'Something went wrong!'
      });
   }
});

usersRouter.put('/:id', async (req, res) => {
   const { id } = req.params;
   const { firstName, lastName, email } = req.body;
   try {
      const user = await userService.updateUser(id, firstName, lastName, email);
      return res.status(201).json({
         status: 'success',
         msg: 'user Updated',
         data: user,
      });
   } catch (e) {
      return res.status(500).json({
         status: 'error',
         msg: 'Something went wrong!'
      });
   }
});

usersRouter.delete('/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);
      return res.status(200).json({
         status: 'success',
         msg: 'user deleted',
         data: deleted,
      });
   } catch (e) {
      console.log(e);
      return res.status(500).json({
         status: 'error',
         msg: 'Something went wrong!'
      });
   }
});
