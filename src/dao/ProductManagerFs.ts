import * as fs from 'fs';

interface Product {
    title: string;
    description: string;
    code: string;
    price: number;
    status: boolean;
    stock: number;
    category: string;
    thumbnails?: string[];
    id?: number;
}

export class ProductManager {
    private path: string;
    public id: number = 0;
    public products: Product[] = [];

    constructor(path: string, id?: number, products?: Product[]) {
        this.path = path + '.json';
        this.id = id ?? 0;
        this.products = products ?? [];

        // Checking if the .json file exists, else create it.
        if (fs.existsSync(this.path)) {
            const productsJson = fs.readFileSync(this.path, 'utf-8');
            const productsString = JSON.parse(productsJson);
            this.products = productsString;
        } else {
            fs.writeFileSync(this.path, '[]');
            this.products = [];
        }
    }

    async addProduct(product: Product) {
        const codeUnique = this.products.find((p) => p.code === product.code);
        if (codeUnique) {
            return `Product already exists.`;
        } else {
            const lastProduct = this.products[this.products.length - 1];
            this.id = lastProduct ? lastProduct.id! + 1 : 1;
            product.id = this.id;
            product.status = true;
            this.products.push(product);
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
                return `The product "${product.title}" was added successfully.`;
            } catch (error) {
                return `An error occurred while adding the product`;
            }
        }
    }

    async getProduct(id: number) {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const products = JSON.parse(data) as Product[];
        const productForId = products.find((p) => p.id === id);
        if (productForId) {
            return productForId;
        } else {
            return 'Product not found.';
        }
    }

    async getProducts() {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const products = JSON.parse(data);
        return products;
    }

    async updateProduct(id: number, updateData: []) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex !== -1) {
            const updatedProduct = { ...this.products[productIndex], ...updateData };
            this.products[productIndex] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            return `The product "${updatedProduct.title}" was updated successfully.`;
        } else {
            return 'Product not found.';
        }
    }

    async deleteProduct(id: number) {
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) {
            return 'Product not found.';
        } else {
            const product = this.products[index];
            this.products.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            return `The product "${product.title}" was deleted successfully.`;
        }
    }

    async deleteAll() {
        this.products = [];
        await fs.promises.writeFile(this.path, JSON.stringify(this.products));
        return `Products was deleted successful.`;
    }
}
