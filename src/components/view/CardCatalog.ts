import { ensureElement } from '../../utils/utils';
import { Card } from './Card';
import { categoryMap } from '../../utils/constants';

export class CardCatalog extends Card { // дочерний класс для карточки в каталоге, наследуемся от базового класса Card
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) { // в конструктор передаем объект с коллбеком для клика по карточке, который будет открывать превью товара
        super(container); // вызов родительского конструктора Card

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) { // 
            container.addEventListener('click', actions.onClick); // ставим слушатель клика на всю карточку, чтобы открывать превью при клике в любом месте карточки
        }
    }

    set category(value: string) { // при установке категории мы не только меняем текст, но и класс элемента, чтобы отображать цвет категории
            this.categoryElement.textContent = value;
            const classesToRemove = Object.values(categoryMap); // удаляем все возможные классы категорий, чтобы не было конфликтов классов при смене категории
            this.categoryElement.classList.remove(...classesToRemove); // удаляем все классы, которые могут быть на элементе категории
            
            const modifier = categoryMap[value as keyof typeof categoryMap]; // получаем класс для текущей категории из мапы, которая сопоставляет название категории с классом
            if (modifier) {
                this.categoryElement.classList.add(modifier); // добавляем класс для текущей категории, если он есть в мапе
            }
    }

    set image(value: string) { // при установке картинки используем метод из базового класса, который устанавливает src и alt для картинки, а также обрабатывает ошибку загрузки картинки
        this.setImage(this.imageElement, value, this.titleElement?.textContent);
    }
}