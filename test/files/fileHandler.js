import { expect, assert } from "chai";
import { getFile } from "../../tools/fileFormatter.js";
import readFile from "../../tools/fileReader.js";
import ERROR_DICTIONARY from "../../utils/errorsDictionary.js";

describe("Use case when filename specified is not into the defined commands directory in utils/config.js", () => {
  it("empty.txt in fileReader script : Should return exception with FILE_NOT_FOUND error from error dictionary utility", async () => {
    try {
      await readFile("empty.txt");
      assert.fail("An exception was expected.");
    } catch (error) {
      assert.strictEqual(error.message, ERROR_DICTIONARY.FILE_NOT_FOUND);
    }
  });
});

describe("Use case when filename specified is not provided", () => {
  it("undefined in getFile script : Should return exception with FILENAME_NOT_PROVIDED error from error dictionary utility", async () => {
    try {
      await getFile(undefined);
      assert.fail("An exception was expected.");
    } catch (error) {
      assert.strictEqual(error.message, ERROR_DICTIONARY.FILENAME_NOT_PROVIDED);
    }
  });
});

describe("Use case when filename specified has a not allowed extension into the defined extensions allowed in utils/config.js", () => {
  it("commands.sql in fileReader script : Should return exception with EXT_NOT_ALLOWED error from error dictionary utility", async () => {
    try {
      await getFile("commands.sql");
      assert.fail("An exception was expected.");
    } catch (error) {
      assert.strictEqual(error.message, ERROR_DICTIONARY.EXT_NOT_ALLOWED);
    }
  });
});

describe("Use case when filename specified is into the defined commands directory in utils/config.js", () => {
  it("commands.txt in fileReader script : Should continue the execution without throwing any exceptions, returning an array type", async () => {
    try {
      const file_formatted = await readFile("commands.txt");
      assert.equal(typeof file_formatted, "object");
    } catch (error) {
      assert.fail("Unexpected exception");
    }
  });
});
