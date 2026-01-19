/**
 * @jest-environment jsdom
 */

import { Numbering } from './Numbering';

import { SVGTextElementMock } from './SVGTextElementMock';

import { NucleobaseMock } from './NucleobaseMock';

describe('`class Numbering`', () => {
  test('`static numbering()`', () => {
    let b = new NucleobaseMock();
    b.centerPoint.x = 107.3;
    b.centerPoint.y = -51;

    let bn = Numbering.numbering(b, 27);

    // was assigned a UUID
    expect(bn.id.length).toBeGreaterThanOrEqual(36);
    expect(bn.domNode.id.length).toBeGreaterThanOrEqual(36);

    expect(bn.textContent).toBe('27');

    Object.entries(Numbering.defaultValues.attributes).forEach(([name, value]) => {
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

    var bn = new Numbering(domNode, owner);

    expect(bn.domNode).toBe(domNode);
    expect(bn.owner).toBe(owner);

    expect(bn.displacement.x).toBeCloseTo(-17);
    expect(bn.displacement.y).toBeCloseTo(143.5);

    owner.centerPoint.x = 74;
    owner.centerPoint.y = 116;

    // cached and maintained displacement
    expect(bn.centerPoint.x).toBeCloseTo(57);
    expect(bn.centerPoint.y).toBeCloseTo(259.5);

    domNode.dataset.displacement = JSON.stringify({ x: 25, y: -10 });

    var n = new Numbering(domNode, owner);

    // does not overwrite pre-existing cached displacement
    expect(n.displacement.x).toBeCloseTo(25);
    expect(n.displacement.y).toBeCloseTo(-10);
  });

  test('`get id()`', () => {
    let domNode = SVGTextElementMock.create();
    domNode.id = 'id-182418274892';

    let bn = new Numbering(domNode, new NucleobaseMock());
    expect(bn.id).toBe('id-182418274892');
  });

  test('`hasAttribute()`', () => {
    let domNode = SVGTextElementMock.create();
    domNode.setAttribute('font-style', 'italic');

    let bn = new Numbering(domNode, new NucleobaseMock());
    expect(bn.hasAttribute('font-style')).toBe(true);

    expect(domNode.hasAttribute('font-weight')).toBe(false);
    expect(bn.hasAttribute('font-weight')).toBe(false);
  });

  test('`getAttribute()`', () => {
    let domNode = SVGTextElementMock.create();
    domNode.setAttribute('font-size', '18.249cm');

    let bn = new Numbering(domNode, new NucleobaseMock());
    expect(bn.getAttribute('font-size')).toBe('18.249cm');

    expect(bn.hasAttribute('font-style')).toBeFalsy();
    expect(bn.getAttribute('font-style')).toBe(null);
  });

  test('`setAttribute()`', () => {
    let domNode = SVGTextElementMock.create();

    let bn = new Numbering(domNode, new NucleobaseMock());

    expect(domNode.hasAttribute('font-style')).toBeFalsy();

    bn.setAttribute('font-style', 'italic');
    expect(domNode.getAttribute('font-style')).toBe('italic');
  });

  test('`setAttributes()`', () => {
    let domNode = SVGTextElementMock.create();

    let bn = new Numbering(domNode, new NucleobaseMock());

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

    let bn = new Numbering(domNode, new NucleobaseMock());

    domNode.setAttribute('font-size', '72.1cm');
    expect(domNode.hasAttribute('font-size')).toBeTruthy();

    bn.removeAttribute('font-size');
    expect(domNode.hasAttribute('font-size')).toBeFalsy();
  });

  test('`get textContent()`', () => {
    let domNode = SVGTextElementMock.create();
    domNode.textContent = '19.316';

    let bn = new Numbering(domNode, new NucleobaseMock());
    expect(bn.textContent).toBe('19.316');
  });

  test('`set textContent()`', () => {
    var domNode = SVGTextElementMock.create();

    var n = new Numbering(domNode, new NucleobaseMock());

    n.textContent = '25';
    expect(domNode.textContent).toBe('25');
  });

  test('`get number()`', () => {
    var n = Numbering.numbering(new NucleobaseMock(), 106);
    expect(n.number).toBe(106);

    n.textContent = '52.1';
    expect(n.number).toBe(52.1);
  });

  test('`set number()`', () => {
    var n = Numbering.numbering(new NucleobaseMock(), 1);
    expect(n.textContent).toBe('1');

    n.number = 204;
    expect(n.textContent).toBe('204');
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

    let bn = new Numbering(domNode, owner);

    expect(bn.displacement.x).toBeCloseTo(-20);
    expect(bn.displacement.y).toBeCloseTo(43.5);
    expect(bn.displacement.magnitude).toBeCloseTo(((-20)**2 + (43.5)**2)**0.5);
    expect(bn.displacement.direction).toBeCloseTo(Math.atan2(43.5, -20));

    bn.displacement.x = 12;
    owner.centerPoint.x += 24;
    expect(domNode.getAttribute('x')).toBe('130');
    expect(domNode.getAttribute('y')).toBe('283');

    bn.displacement.y = -19;
    owner.centerPoint.y += 50;
    expect(domNode.getAttribute('x')).toBe('130');
    expect(domNode.getAttribute('y')).toBe('270.5');

    bn.displacement.magnitude = 40;
    owner.centerPoint.x -= 10;
    expect(bn.domNode.getAttribute('x')).toBe(`${115 + (40 * Math.cos(Math.atan2(-19, 12))) - 7}`);
    expect(bn.domNode.getAttribute('y')).toBe(`${300 + (40 * Math.sin(Math.atan2(-19, 12))) - 10.5}`);

    bn.displacement.direction = 5.21 * Math.PI;
    owner.centerPoint.y -= 20;
    expect(bn.domNode.getAttribute('x')).toBe(`${115 + (40 * Math.cos(5.21 * Math.PI)) - 7}`);
    expect(bn.domNode.getAttribute('y')).toBe(`${280 + (40 * Math.sin(5.21 * Math.PI)) - 10.5}`);
  });

  test('`serialized()`', () => {
    let owner = new NucleobaseMock();
    owner.id = 'id-18498128444';

    let bn = Numbering.numbering(owner, -157);
    bn.domNode.id = 'id-9983719842';

    expect(bn.serialized().id).toBe('id-9983719842');
    expect(bn.serialized().ownerID).toBe('id-18498128444');
  });

  test('`static deserialized()`', () => {
    let parentDrawing = new DrawingMock();
    for (let i = 0; i < 10; i++) { parentDrawing.bases.push(new NucleobaseMock()); }

    let bn1 = Numbering.numbering(parentDrawing.bases[6], 112);
    parentDrawing.domNode.insertBefore(bn1.domNode, parentDrawing.bases[3].domNode);

    expect(bn1.domNode).toBeTruthy();
    expect(bn1.owner).toBeTruthy();
    bn1.displacement.x = -174;
    bn1.displacement.y = 88.4;

    // not defined by JSDOM by default
    globalThis.SVGTextElement = globalThis.SVGTextElement ?? SVGElement;

    let bn2 = Numbering.deserialized(bn1.serialized(), parentDrawing);

    expect(bn2.domNode).toBe(bn1.domNode);
    expect(bn2.owner).toBe(bn1.owner);
    expect(bn2.displacement.x).toBeCloseTo(-174);
    expect(bn2.displacement.y).toBeCloseTo(88.4);

    // without saved displacement
    let bn3 = Numbering.deserialized({ ...bn1.serialized(), displacement: undefined }, parentDrawing);

    expect(bn3.domNode).toBe(bn1.domNode);
    expect(bn3.owner).toBe(bn1.owner);
    expect(bn3.displacement.x).toBeCloseTo(-174);
    expect(bn3.displacement.y).toBeCloseTo(88.4);
  });
});

const createElementNS = document.createElementNS;

document.createElementNS = (...args) => {
  if (args[0] === 'http://www.w3.org/2000/svg' && args[1] === 'text') {
    return SVGTextElementMock.create();
  } else {
    return createElementNS.call(document, ...args);
  }
};

class DrawingMock {
  domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  bases = [];
}
