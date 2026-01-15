import { VersionlessNumbering } from './VersionlessNumbering';

describe('`class VersionlessNumbering`', () => {
  test('`get id()`', () => {
    var numbering = new VersionlessNumbering({ id: '2140928491824' });
    expect(numbering.id).toBe('2140928491824');

    var numbering = new VersionlessNumbering({ textId: '82358391847284' });
    expect(numbering.id).toBe('82358391847284');
  });

  test('`get ownerID()`', () => {
    var numbering = new VersionlessNumbering({ ownerID: '9481849284928' });
    expect(numbering.ownerID).toBe('9481849284928');
  });

  test('`get displacement()`', () => {
    let numbering = new VersionlessNumbering({ displacement: { x: 5, y: 27 } });

    expect(numbering.displacement).toStrictEqual({ x: 5, y: 27 });
  });
});
