/**
 * Meant for testing purposes.
 */
export class EventfulPoint {
  #eventListeners = {
    'move': [],
  };

  addEventListener(name, listener) {
    this.#eventListeners[name].push(listener);
  }

  #callEventListeners(name) {
    this.#eventListeners[name].forEach(listener => listener());
  }

  #x = 0;
  #y = 0;

  get x() { return this.#x; }
  set x(x) {
    this.#x = x;
    this.#callEventListeners('move');
  }

  get y() { return this.#y; }
  set y(y) {
    this.#y = y;
    this.#callEventListeners('move');
  }

  /**
   * Set the X and Y coordinates of this point to those of the given point.
   */
  set(point) {
    this.x = point.x;
    this.y = point.y;
  }
}
