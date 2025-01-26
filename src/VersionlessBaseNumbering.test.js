import { VersionlessBaseNumbering } from './VersionlessBaseNumbering';

describe('`class VersionlessBaseNumbering`', () => {
  test('`get id()`', () => {
    var baseNumbering = new VersionlessBaseNumbering({ id: '2140928491824' });
    expect(baseNumbering.id).toBe('2140928491824');

    var baseNumbering = new VersionlessBaseNumbering({ textId: '82358391847284' });
    expect(baseNumbering.id).toBe('82358391847284');
  });

  test('`get ownerID()`', () => {
    var baseNumbering = new VersionlessBaseNumbering({ ownerID: '9481849284928' });
    expect(baseNumbering.ownerID).toBe('9481849284928');
  });

  test('`get displacement()`', () => {
    let baseNumbering = new VersionlessBaseNumbering({ displacement: { x: 5, y: 27 } });

    expect(baseNumbering.displacement).toStrictEqual({ x: 5, y: 27 });
  });
});
