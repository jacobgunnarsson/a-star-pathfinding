interface Listener {
  eventName: string;
  element: HTMLElement;
  callback: (event: Event) => void;
}

export class IO {
  private listeners: Listener[] = [];

  constructor() {
    this.addEventListeners();
  }

  public on(eventName: string, element: HTMLElement, callback: (event: Event) => void) {
    element.addEventListener(eventName, callback);

    this.listeners.push({ eventName, element, callback });
  }

  private addEventListeners() {

  }
}

export const IOInstance = new IO();
