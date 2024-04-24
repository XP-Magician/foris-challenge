// TEST FOR VALIDATING THE REGEX AND TREATMENT ASSOCIATED WITH A PARTICULAR COMMAND
import { VALIDATORS } from "../../helpers/validators.js";
import assert from "assert";

// FOR STUDENT COMMAND
describe("Validate 'Student' basic command structure", () => {
  it("Student Diego abc 15 : should return false (unexpected/invalid command structure)", () => {
    const wrong_command_structure = "Student Diego abc 15";
    assert.equal(
      VALIDATORS.STUDENT_COMMAND.test(wrong_command_structure),
      false
    );
  });
  it("Student : should return false (missing name_student field)", () => {
    const missing_name = "Student";
    assert.equal(VALIDATORS.STUDENT_COMMAND.test(missing_name), false);
  });
  it("Student Diego : should return true (expected command structure)", () => {
    const good_command_structure = "Student Diego";
    assert.equal(VALIDATORS.STUDENT_COMMAND.test(good_command_structure), true);
  });
  it(" Student Diego : should return false (extra identation at start and ending of the string)", () => {
    const idented_command_structure = " Student Diego ";
    assert.equal(
      VALIDATORS.STUDENT_COMMAND.test(idented_command_structure),
      false
    );
  });
  it("Student  Diego : should return false (extra identation between Student keyword and name_field)", () => {
    const idented_command_structure = " Student  Diego ";
    assert.equal(
      VALIDATORS.STUDENT_COMMAND.test(idented_command_structure),
      false
    );
  });
  it("STUDENT Diego : should return false (sensible case regex at Student keyword)", () => {
    const idented_command_structure = "STUDENT Diego";
    assert.equal(
      VALIDATORS.STUDENT_COMMAND.test(idented_command_structure),
      false
    );
  });
});

// FOR PRESENCE COMMAND
describe("Validate 'Presence' basic command structure", () => {
  it("Presence Diego 1 09:02 10:17 R100 extra_field : should return false (unexpected/invalid command structure)", () => {
    const extra_field_command = "Presence Diego 1 09:02 10:17 R100 extra_field";
    assert.equal(VALIDATORS.PRESENCE_COMMAND.test(extra_field_command), false);
  });

  it("Presence 1 09:02 10:17 R100 extra_field : should return false (missing any required field, in this case, name_student one)", () => {
    const missing_field_command =
      "Presence Diego 1 09:02 10:17 R100 extra_field";
    assert.equal(
      VALIDATORS.PRESENCE_COMMAND.test(missing_field_command),
      false
    );
  });

  it("Presence Diego 1 09:02 10:17 R100 : should return true (expected command structure)", () => {
    const good_command_structure = "Presence Diego 1 09:02 10:17 R100";
    assert.equal(
      VALIDATORS.PRESENCE_COMMAND.test(good_command_structure),
      true
    );
  });
  it("Presence Diego abc 09:02 10:17 R100 : should return false (abc instead of a week day)", () => {
    const bad_command_day = "Presence Diego abc 09:02 10:17 R100";
    assert.equal(VALIDATORS.PRESENCE_COMMAND.test(bad_command_day), false);
  });
  it("Presence Diego 2 24:00 10:17 R100 : should return false (24:00 invalid/not allowed format hour at enter hour)", () => {
    const invalid_enter_hour = "Presence Diego 2 24:00 10:17 R100";
    assert.equal(VALIDATORS.PRESENCE_COMMAND.test(invalid_enter_hour), false);
  });
  it("Presence Diego 2 08:00 24:00 R100 : should return false (24:00 invalid/not allowed format hour at left hour)", () => {
    const invalid_left_hour = "Presence Diego 2 08:00 24:00 R100";
    assert.equal(VALIDATORS.PRESENCE_COMMAND.test(invalid_left_hour), false);
  });
  it("Presence Diego 2 08:00 12:00 100CPLS : should return false (100CPLS invalid classroom code)", () => {
    const invalid_classroom_code = "Presence Diego 2 08:00 12:00 100CPLS";
    assert.equal(
      VALIDATORS.PRESENCE_COMMAND.test(invalid_classroom_code),
      false
    );
  });
  it(" Presence Diego 2 08:00 12:00 R100  : should return false (extra identation at start and ending of the string)", () => {
    const extra_identation_corner = " Presence Diego 2 08:00 12:00 R100 ";
    assert.equal(
      VALIDATORS.PRESENCE_COMMAND.test(extra_identation_corner),
      false
    );
  });
  it("Presence  Diego  2  08:00  12:00  R100  : should return false (extra identation between Presence keyword and fields)", () => {
    const extra_identation_between = "Presence  Diego  2  08:00  12:00  R100";
    assert.equal(
      VALIDATORS.PRESENCE_COMMAND.test(extra_identation_between),
      false
    );
  });
});
