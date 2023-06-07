import { ProductModel } from '../dao/models/products.model.js'

export class ProductService {

    async validateProduct(product){
        const {title, description, code, price, stock, category, thumbnails } = product;
        if(!title || !description || !code || !price || !stock || !category){
            throw new Error('Error, please enter a valid info!');
        }
    }
    async createProduct(product) {
        this.validateProduct(product);
        return await ProductModel.create(product);
      }
    async getProduct(pid){
        return await ProductModel.findOne({_id: pid}).lean();
    }

    async getProducts(){
        return await ProductModel.find({}).lean()
    }

    async deleteProduct(pid){
        const deleted = await ProductModel.deleteOne({_id: pid});
        return `Product ${pid} was successfully deleted!`
    }
}