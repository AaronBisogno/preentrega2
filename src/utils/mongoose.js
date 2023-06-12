import { connect } from 'mongoose';

export async function environment() {
   try {
      await connect('mongodb+srv://aaronchodev:DfarmP7npcTtbgn9@ecommerce.igp15kx.mongodb.net/ecommerce?retryWrites=true&w=majority');
      console.log('MongoDB connection established!');
   } catch (e) {
      console.log(e);
      throw new Error("Can't connect with MongoDB :(");
   }
}
