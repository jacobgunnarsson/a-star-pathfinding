interface Listener {
  eventName: string;
  element: Element;
  callback: (event: Event) => void;
}

export class IOService {
  private listeners: Listener[] = [];

  constructor() {
    this.addEventListeners();
  }

  public on(eventName: string, element: Element, callback: (event: Event) => void) {
    element.addEventListener(eventName, callback);

    this.listeners.push({ eventName, element, callback });
  }

  private addEventListeners() {

  }
}

export const IOServiceInstance = new IOService();
