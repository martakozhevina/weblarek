import { Component } from '../base/Component';

export interface IGalleryData { // интерфейс данных для галереи
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    // поле для хранения элемента каталога
    protected catalogElement: HTMLElement;

    /**
     * Конструктор класса Gallery
     * @param container — корневой элемент галереи селектор .gallery
     */
    constructor(container: HTMLElement) {
        super(container);
        
        // в нашей разметке контейнер .gallery и есть элемент каталога
        this.catalogElement = container;
    }

    /**
     * сеттер для заполнения галереи карточками товаров
     * @param items — массив готовых DOM-элементов карточек
     */
    set catalog(items: HTMLElement[]) {
        // очищаем галерею перед добавлением новых элементов
        this.catalogElement.replaceChildren(...items);
    }
}