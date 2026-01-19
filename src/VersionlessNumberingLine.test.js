import { VersionlessNumberingLine } from './VersionlessNumberingLine';

describe('`class VersionlessNumberingLine`', () => {
  test('`get id()`', () => {
    var numberingLine = new VersionlessNumberingLine({ id: '183941829489124' });
    expect(numberingLine.id).toBe('183941829489124');

    var numberingLine = new VersionlessNumberingLine({ lineId: '938142948928492' });
    expect(numberingLine.id).toBe('938142948928492');
  });

  test('`get ownerID()`', () => {
    var numberingLine = new VersionlessNumberingLine({ ownerID: '3781972y498124' });
    expect(numberingLine.ownerID).toBe('3781972y498124');

    var numberingLine = new VersionlessNumberingLine({ textId: '882782194782' });
    expect(numberingLine.ownerID).toBe('882782194782');
  });

  test('`get basePadding()`', () => {
    var numberingLine = new VersionlessNumberingLine({ basePadding: 28.451 });

    expect(numberingLine.basePadding).toBe(28.451);
  });

  test('`get textPadding()`', () => {
    var numberingLine = new VersionlessNumberingLine({ textPadding: 25.2 });
    expect(numberingLine.textPadding).toBe(25.2);

    var numberingLine = new VersionlessNumberingLine({ numberingPadding: 104.82 });
    expect(numberingLine.textPadding).toBe(104.82);
  });
});
