import { IApi, IOrder, IOrderResult, IProductList } from '../../../types';

export class ApiWebLarek {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    // Метод для получения списка товаров
    getProducts(): Promise<IProductList> {
        return this._api.get<IProductList>('/product/');
    }

    // Метод для отправки заказа
    postOrder(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order/', order);
    }
}