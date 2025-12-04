type Listener = (...args: any[]) => void;

export class EventEmitter {
  private events: Record<string, Listener[]> = {};

  public on(event: string, listener: Listener): void {
    const handlers = this.events[event] || [];
    handlers.push(listener);
    this.events[event] = handlers;
  }

  public off(event: string, listenerToRemove: Listener): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
  }

  public emit(event: string, ...args: any[]): void {
    const handlers = this.events[event];
    if (!handlers) return;
    handlers.forEach(listener => listener(...args));
  }
}