import showModal from './modal';
import createElement from '../../helpers/domHelper';

export default function showWinnerModal(fighter) {
    const bodyElement = createElement({
        tagName: 'div',
        className: 'modal-body'
    });

    bodyElement.innerText = `${fighter.name} wins!`;

    showModal({
        title: 'Winner',
        bodyElement
    });
}
