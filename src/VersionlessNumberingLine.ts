import { isNonNullObject } from '@rnacanvas/value-check';

import { isString } from '@rnacanvas/value-check';

/**
 * For working with saved numbering lines, which might possibly use old, legacy formats.
 */
export class VersionlessNumberingLine {
  #savedNumberingLine;

  constructor(savedNumberingLine: unknown) {
    if (!isNonNullObject(savedNumberingLine)) {
      throw new Error('Saved numbering lines must be non-null objects.');
    }

    this.#savedNumberingLine = savedNumberingLine;
  }

  /**
   * Throws if unable to find the ID of the saved numbering line.
   */
  get id(): string | never {
    if (isString(this.#savedNumberingLine.id)) {
      return this.#savedNumberingLine.id;
    }

    // used to be saved as `lineId`
    if (isString(this.#savedNumberingLine.lineId)) {
      return this.#savedNumberingLine.lineId;
    }

    throw new Error('Unable to find saved numbering line ID.');
  }

  /**
   * Throws if unable to find the owner ID of the saved numbering line.
   */
  get ownerID(): string | never {
    if (isString(this.#savedNumberingLine.ownerID)) {
      return this.#savedNumberingLine.ownerID;
    }

    // used to be saved as `textId`
    if (isString(this.#savedNumberingLine.textId)) {
      return this.#savedNumberingLine.textId;
    }

    throw new Error('Unable to find saved numbering line owner ID.');
  }

  get basePadding(): unknown {
    return this.#savedNumberingLine.basePadding;
  }

  get textPadding(): unknown {
    // used to be saved under numbering padding
    if (this.#savedNumberingLine.numberingPadding !== undefined) {
      return this.#savedNumberingLine.numberingPadding;
    }

    return this.#savedNumberingLine.textPadding;
  }
}
