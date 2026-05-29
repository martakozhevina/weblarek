import { IProduct } from '../../types';
import { IEvents } from "../base/Events";

export class CatalogModel {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]): void { // сохр массива товаров
        this.items = items;
        this.events.emit('items:changed', { items: this.items }); // уведомляем презентер об изменении массива товаров, передавая новый массив
    }

    getItems(): IProduct[] { //получ массива т
        return this.items;
    }

    getItem(id: string): IProduct| undefined { //получ товара по id
        return this.items.find(item => item.id === id);
    }

    setPreview(item: IProduct): void {
        this.preview = item;
        this.events.emit('preview:changed', { item: this.preview }); // уведомляем презентер об изменении товара для превью, передавая новый товар
    }

    getPreview(): IProduct | null { //получ т для превью
        return this.preview;
    }
}