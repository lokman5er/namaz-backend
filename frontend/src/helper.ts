/**
 * checks if element is an instanceof HTMLElement
 *
 * @param element takes any kind of object and checks the type
 * @returns the very same object as a HTMLElement
 */
export function ensureHTMLElement(element: Element | null): HTMLElement {
    if (element instanceof HTMLElement) {
        return element;
    } else {
        throw new Error();
    }
}