import { IProduct } from "../../types";

export class BasketModel {
    protected items: IProduct[] = [];

    constructor() {}

    getItems(): IProduct[] { //получ массива товаров в корзине
        return this.items;
    }

    addItem(item: IProduct): void { //добавление товара в корзину
        this.items.push(item);
    }

    removeItem(id: string): void { //удаление товара из корзины по id
        this.items = this.items.filter(item => item.id !== id);
    }

    clear(): void { //очистка корзины
        this.items = [];
    }

    getTotalPrice(): number { //получ общ стоимости товаров в корзине
        return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    getItemCount(): number { //получ кол-ва товаров в корзине
        return this.items.length;
    }

    checkInBasket(id: string): boolean { //проверка наличия товара в корзине по id
        return this.items.some(item => item.id === id);
    }
}