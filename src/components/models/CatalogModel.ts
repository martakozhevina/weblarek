import { IProduct } from '../../types';

export class CatalogModel {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    constructor() {}

    setItems(items: IProduct[]): void { // сохр массива товаров
        this.items = items;
    }

    getItems(): IProduct[] { //получ массива т
        return this.items;
    }

    getItem(id: string): IProduct| undefined { //получ товара по id
        return this.items.find(item => item.id === id);
    }

    setPreview(item: IProduct): void {
        this.preview = item;
    }

    getPreview(): IProduct | null { //получ т для превью
        return this.preview;
    }
}