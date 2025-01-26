import { VersionlessBaseNumberingLine } from './VersionlessBaseNumberingLine';

describe('`class VersionlessBaseNumberingLine`', () => {
  test('`get id()`', () => {
    var baseNumberingLine = new VersionlessBaseNumberingLine({ id: '183941829489124' });
    expect(baseNumberingLine.id).toBe('183941829489124');

    var baseNumberingLine = new VersionlessBaseNumberingLine({ lineId: '938142948928492' });
    expect(baseNumberingLine.id).toBe('938142948928492');
  });

  test('`get ownerID()`', () => {
    var baseNumberingLine = new VersionlessBaseNumberingLine({ ownerID: '3781972y498124' });
    expect(baseNumberingLine.ownerID).toBe('3781972y498124');

    var baseNumberingLine = new VersionlessBaseNumberingLine({ textId: '882782194782' });
    expect(baseNumberingLine.ownerID).toBe('882782194782');
  });

  test('`get basePadding()`', () => {
    var baseNumberingLine = new VersionlessBaseNumberingLine({ basePadding: 28.451 });

    expect(baseNumberingLine.basePadding).toBe(28.451);
  });

  test('`get numberingPadding()`', () => {
    var baseNumberingLine = new VersionlessBaseNumberingLine({ numberingPadding: 104.82 });

    expect(baseNumberingLine.numberingPadding).toBe(104.82);
  });
});
