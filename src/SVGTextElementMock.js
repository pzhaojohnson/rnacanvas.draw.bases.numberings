const createElementNS = document.createElementNS;

/**
 * Meant for testing purposes.
 */
export const SVGTextElementMock = {
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
