import { isNonNullObject } from '@rnacanvas/value-check';

import { isString } from '@rnacanvas/value-check';

/**
 * For working with saved base numbering lines, which might possibly use old, legacy formats.
 */
export class VersionlessBaseNumberingLine {
  #savedBaseNumberingLine;

  constructor(savedBaseNumberingLine: unknown) {
    if (!isNonNullObject(savedBaseNumberingLine)) {
      throw new Error('Saved base numbering lines must be non-null objects.');
    }

    this.#savedBaseNumberingLine = savedBaseNumberingLine;
  }

  /**
   * Throws if unable to find the ID of the saved base numbering line.
   */
  get id(): string | never {
    if (isString(this.#savedBaseNumberingLine.id)) {
      return this.#savedBaseNumberingLine.id;
    }

    // used to be saved as `lineId`
    if (isString(this.#savedBaseNumberingLine.lineId)) {
      return this.#savedBaseNumberingLine.lineId;
    }

    throw new Error('Unable to find the ID of the saved base numbering line.');
  }

  /**
   * Throws if unable to find the owner ID of the saved base numbering line.
   */
  get ownerID(): string | never {
    if (isString(this.#savedBaseNumberingLine.ownerID)) {
      return this.#savedBaseNumberingLine.ownerID;
    }

    // used to be saved as `textId`
    if (isString(this.#savedBaseNumberingLine.textId)) {
      return this.#savedBaseNumberingLine.textId;
    }

    throw new Error('Unable to find the owner ID of the saved base numbering line.');
  }

  get basePadding(): unknown {
    return this.#savedBaseNumberingLine.basePadding;
  }

  get numberingPadding(): unknown {
    return this.#savedBaseNumberingLine.numberingPadding;
  }
}
