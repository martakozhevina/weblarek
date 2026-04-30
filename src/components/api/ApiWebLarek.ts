import { IApi, IOrder, IOrderResult, IProductList } from '../../types';

export class ApiWebLarek {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    // Метод для получения списка товаров
    getProducts(): Promise<IProductList> {
        return this.api.get<IProductList>('/product/');
    }

    // Метод для отправки заказа
    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}