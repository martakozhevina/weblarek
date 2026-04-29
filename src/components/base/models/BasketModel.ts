import { IProduct } from "../../../types";

export class BasketModel {
    protected _items: IProduct[] = [];

    constructor() {}

    getItems(): IProduct[] { //получ массива товаров в корзине
        return this._items;
    }

    addItem(item: IProduct): void { //добавление товара в корзину
        this._items.push(item);
    }

    removeItem(id: string): void { //удаление товара из корзины по id
        this._items = this._items.filter(item => item.id !== id);
    }

    clear(): void { //очистка корзины
        this._items = [];
    }

    getTotalPrice(): number { //получ общ стоимости товаров в корзине
        return this._items.reduce((total, item) => total + (item.price || 0), 0);
    }

    getItemCount(): number { //получ кол-ва товаров в корзине
        return this._items.length;
    }

    checkInBasket(id: string): boolean { //проверка наличия товара в корзине по id
        return this._items.some(item => item.id === id);
    }
}