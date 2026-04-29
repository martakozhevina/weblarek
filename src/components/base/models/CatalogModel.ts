import { IProduct } from '../../../types';

export class CatalogModel {
    protected _items: IProduct[] = [];
    protected _preview: IProduct | null = null;

    constructor() {}

    setItems(items: IProduct[]): void { // сохр массива товаров
        this._items = items;
    }

    getItems(): IProduct[] { //получ массива т
        return this._items;
    }

    getItem(id: string): IProduct| undefined { //получ товара по id
        return this._items.find(item => item.id === id);
    }

    setPreview(item: IProduct): void {
        this._preview = item;
    }

    getPreview(): IProduct | null { //получ т для превью
        return this._preview;
    }
}