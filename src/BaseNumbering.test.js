/**
 * @jest-environment jsdom
 */

import { BaseNumbering } from './BaseNumbering';

describe('`class BaseNumbering`', () => {
  test('`static numbering()`', () => {
    let b = new NucleobaseMock();
    b.centerPoint.x = 107.3;
    b.centerPoint.y = -51;

    let bn = BaseNumbering.numbering(b, 27);

    // was assigned a UUID
    expect(bn.id.length).toBeGreaterThanOrEqual(36);
    expect(bn.domNode.id.length).toBeGreaterThanOrEqual(36);

    expect(bn.textContent).toBe('27');

    Object.entries(BaseNumbering.defaultValues.attributes).forEach(([name, value]) => {
      expect(bn.getAttribute(name)).toBe(value);
    });

    expect(bn.displacement.magnitude).toBeCloseTo(0);
  });

  test('`constructor()`', () => {
    let domNode = SVGTextElementMock.create();

    domNode.setAttribute('x', '29');
    domNode.setAttribute('y', '113');
    domNode.setAttribute('font-size', '15');

    let owner = new NucleobaseMock();

    owner.centerPoint.x = 51;
    owner.centerPoint.y = -23;

    let bn = new BaseNumbering(domNode, owner);

    expect(bn.domNode).toBe(domNode);
    expect(bn.owner).toBe(owner);

    owner.centerPoint.x = 74;
    expect(bn.centerPoint.x).toBeCloseTo(57);

    owner.centerPoint.y = 116;
    expect(bn.centerPoint.y).toBeCloseTo(259.5);
  });

  test('`get id()`', () => {
    let domNode = SVGTextElementMock.create();
    domNode.id = 'id-182418274892';

    let bn = new BaseNumbering(domNode, new NucleobaseMock());
    expect(bn.id).toBe('id-182418274892');
  });

  test('`get textContent()`', () => {
    let domNode = SVGTextElementMock.create();
    domNode.textContent = '19.316';

    let bn = new BaseNumbering(domNode, new NucleobaseMock());
    expect(bn.textContent).toBe('19.316');
  });

  test('`hasAttribute()`', () => {
    let domNode = SVGTextElementMock.create();
    domNode.setAttribute('font-style', 'italic');

    let bn = new BaseNumbering(domNode, new NucleobaseMock());
    expect(bn.hasAttribute('font-style')).toBe(true);

    expect(domNode.hasAttribute('font-weight')).toBe(false);
    expect(bn.hasAttribute('font-weight')).toBe(false);
  });

  test('`getAttribute()`', () => {
    let domNode = SVGTextElementMock.create();
    domNode.setAttribute('font-size', '18.249cm');

    let bn = new BaseNumbering(domNode, new NucleobaseMock());
    expect(bn.getAttribute('font-size')).toBe('18.249cm');

    expect(bn.hasAttribute('font-style')).toBeFalsy();
    expect(bn.getAttribute('font-style')).toBe(null);
  });

  test('`setAttribute()`', () => {
    let domNode = SVGTextElementMock.create();

    let bn = new BaseNumbering(domNode, new NucleobaseMock());

    expect(domNode.hasAttribute('font-style')).toBeFalsy();

    bn.setAttribute('font-style', 'italic');
    expect(domNode.getAttribute('font-style')).toBe('italic');
  });

  test('`setAttributes()`', () => {
    let domNode = SVGTextElementMock.create();

    let bn = new BaseNumbering(domNode, new NucleobaseMock());

    expect(() => bn.setAttributes({})).not.toThrow();

    bn.setAttributes({ 'font-size': '25.01pt' });
    expect(domNode.getAttribute('font-size')).toBe('25.01pt');

    bn.setAttributes({ 'font-size': '60cm', 'font-weight': '800', 'font-style': 'italic' });
    expect(domNode.getAttribute('font-size')).toBe('60cm');
    expect(domNode.getAttribute('font-weight')).toBe('800');
    expect(domNode.getAttribute('font-style')).toBe('italic');
  });

  test('`removeAttribute()`', () => {
    let domNode = SVGTextElementMock.create();

    let bn = new BaseNumbering(domNode, new NucleobaseMock());

    domNode.setAttribute('font-size', '72.1cm');
    expect(domNode.hasAttribute('font-size')).toBeTruthy();

    bn.removeAttribute('font-size');
    expect(domNode.hasAttribute('font-size')).toBeFalsy();
  });

  test('`get displacement()`', () => {
    let domNode = SVGTextElementMock.create();
    domNode.setAttribute('x', '74');
    domNode.setAttribute('y', '283');
    domNode.setAttribute('font-size', '21');
    domNode.textContent = '5';

    let owner = new NucleobaseMock();
    owner.centerPoint.x = 101;
    owner.centerPoint.y = 250;

    let bn = new BaseNumbering(domNode, owner);

    expect(bn.displacement.x).toBeCloseTo(-20);
    expect(bn.displacement.y).toBeCloseTo(43.5);
    expect(bn.displacement.magnitude).toBeCloseTo(((-20)**2 + (43.5)**2)**0.5);
    expect(bn.displacement.direction).toBeCloseTo(Math.atan2(43.5, -20));

    bn.displacement.x = 12;
    expect(domNode.getAttribute('x')).toBe('106');
    expect(domNode.getAttribute('y')).toBe('283');

    bn.displacement.y = -19;
    expect(domNode.getAttribute('x')).toBe('106');
    expect(domNode.getAttribute('y')).toBe('220.5');

    bn.displacement.magnitude = 40;
    expect(bn.domNode.getAttribute('x')).toBe(`${101 + (40 * Math.cos(Math.atan2(-19, 12))) - 7}`);
    expect(bn.domNode.getAttribute('y')).toBe(`${250 + (40 * Math.sin(Math.atan2(-19, 12))) - 10.5}`);

    bn.displacement.direction = 5.21 * Math.PI;
    expect(bn.domNode.getAttribute('x')).toBe(`${101 + (40 * Math.cos(5.21 * Math.PI)) - 7}`);
    expect(bn.domNode.getAttribute('y')).toBe(`${250 + (40 * Math.sin(5.21 * Math.PI)) - 10.5}`);
  });

  test('`serialized()`', () => {
    let owner = new NucleobaseMock();
    owner.id = 'id-18498128444';

    let bn = BaseNumbering.numbering(owner, -157);
    bn.domNode.id = 'id-9983719842';

    bn.displacement.x = 98.2;
    bn.displacement.y = -33.6;

    expect(bn.serialized().id).toBe('id-9983719842');
    expect(bn.serialized().ownerID).toBe('id-18498128444');
    expect(bn.serialized().displacement.x).toBeCloseTo(98.2);
    expect(bn.serialized().displacement.y).toBeCloseTo(-33.6);
  });

  test('`static deserialized()`', () => {
    let parentDrawing = new DrawingMock();
    for (let i = 0; i < 10; i++) { parentDrawing.bases.push(new NucleobaseMock()); }

    let bn1 = BaseNumbering.numbering(parentDrawing.bases[6], 112);
    parentDrawing.domNode.insertBefore(bn1.domNode, parentDrawing.bases[3].domNode);

    expect(bn1.domNode).toBeTruthy();
    expect(bn1.owner).toBeTruthy();
    bn1.displacement.x = -174;
    bn1.displacement.y = 88.4;

    // not defined by JSDOM by default
    globalThis.SVGTextElement = globalThis.SVGTextElement ?? SVGElement;

    let bn2 = BaseNumbering.deserialized(bn1.serialized(), parentDrawing);

    expect(bn2.domNode).toBe(bn1.domNode);
    expect(bn2.owner).toBe(bn1.owner);
    expect(bn2.displacement.x).toBeCloseTo(-174);
    expect(bn2.displacement.y).toBeCloseTo(88.4);

    // without saved displacement
    let bn3 = BaseNumbering.deserialized({ ...bn1.serialized(), displacement: undefined }, parentDrawing);

    expect(bn3.domNode).toBe(bn1.domNode);
    expect(bn3.owner).toBe(bn1.owner);
    expect(bn3.displacement.x).toBeCloseTo(-174);
    expect(bn3.displacement.y).toBeCloseTo(88.4);
  });
});

const createElementNS = document.createElementNS;

const SVGTextElementMock = {
  create: () => {
    let text = createElementNS.call(document, 'http://www.w3.org/2000/svg', 'text');

    text.setAttribute('x', '0');
    text.setAttribute('y', '0');

    text.x = {
      get baseVal() { return text.getAttribute('x').split(',').map(value => ({ value: Number.parseFloat(value) })); }
    };

    text.y = {
      get baseVal() { return text.getAttribute('y').split(',').map(value => ({ value: Number.parseFloat(value) })); }
    };

    text.getBBox = () => {
      let x = Math.min(...text.x.baseVal.map(length => length.value));
      let y = Math.min(...text.y.baseVal.map(length => length.value));

      let height = Number.parseFloat(text.getAttribute('font-size') ?? '0');
      let width = (2 / 3) * height;

      return { x, y, width, height };
    };

    return text;
  },
}

document.createElementNS = (...args) => {
  if (args[0] === 'http://www.w3.org/2000/svg' && args[1] === 'text') {
    return SVGTextElementMock.create();
  } else {
    return createElementNS.call(document, ...args);
  }
};

class NucleobaseMock {
  id = `${Math.random()}`;

  centerPoint = new EventfulPoint();
}

class EventfulPoint {
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
}

class DrawingMock {
  domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  bases = [];
}
