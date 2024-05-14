// TEST FOR VALIDATING THE VALUES PASSED THROUGH A COMMAND , IT EXECUTES AFTER BASIC REGEX VALIDATORS  AS A SECOND LAYER (commandStructure.js tests)

import { expect } from "chai";
import { commandsExtractor } from "../../tools/commandsExtractor.js";
import { Presence } from "../../entities/Presence.js";
import ERROR_DICTIONARY from "../../utils/errorsDictionary.js";

describe("Allow special format use cases with Student and Presence commands", () => {
  it("  Student Diego   : command with extra identation in the corners should be valid (it's a valid command structure)", async () => {
    //this comes from fileReader in real environment , see test/file validations for more information
    const extra_idented_commands = [
      "   Student Diego   ",
      "Student juan",
      "  Student elena",
      "Student pedro  ",
    ];
    const { Student, ...presences_and_discarded } = await commandsExtractor(
      extra_idented_commands
    );
    // All comands are valid
    expect(Student.length).to.equal(4);
  });
});

describe("Ignore duplicated values in Student and Presence commands", () => {
  it("Student diego Student diego: should return array length 1 , the second one is just ignored, same with Presences.", async () => {
    //this comes from fileReader in real environment , see test/file validations for more information
    const duplicated_commands = [
      "   Student Diego   ",
      "Student Diego",
      "Presence Diego 3 10:58 12:05 R205",
      "  Presence Diego 3 10:58 12:05 R205 ",
    ];
    const { Student, Presence, Discarded } = await commandsExtractor(
      duplicated_commands
    );
    // Should has one student and command because of the duplication
    expect(Student.length).to.equal(1);
    expect(Presence.length).to.equal(1);
  });
});

describe("Discard invalid commands typed", () => {
  it("Student diego abc , Presence 1 , abcabcabc: All of them are invalid, should return Discarded length array of 3", async () => {
    //this comes from fileReader in real environment , see test/file validations for more information
    const invalid_commands = ["Student diego abc", "Presence 1", "abcabcabc"];
    const { Student, Presence, Discarded } = await commandsExtractor(
      invalid_commands
    );
    // Should has 3 array length because all of them are invalid commands
    expect(Discarded.length).to.equal(3);
  });
});

describe("Real use case with multiple valid and invalid commands typed, should return different lengths for every Student,Presence and Discarded array length", () => {
  it("4 Student mixed valid/invalid commands - 4 Presences mixed valid/invalid commands", async () => {
    //this comes from fileReader in real environment , see test/file validations for more information
    const mixed_commands = [
      "Student diego abc",
      "Student Diego",
      "Student Diego",
      "Student",
      "Presence 123",
      "Presence",
      "Presence Diego 3 10:58 12:05 R205",
      "Presence Diego 3 13:00 14:00 R500",
    ];
    const { Student, Presence, Discarded } = await commandsExtractor(
      mixed_commands
    );
    // Should has 1 valid student (ignore duplicated, discard wrong structure),Presence 2, discarded should has 4 commands
    expect(Discarded.length).to.equal(4);
    expect(Student.length).to.equal(1);
    expect(Presence.length).to.equal(2);
  });
});

describe("Use case when the student name in Presence command wasn't registered previously", () => {
  it("Presence Mariana 3 10:58 12:05 R205 (withour Student Mariana) : should return STUDENT_NOT_REGISTERED from error dictionary utility ", async () => {
    //this comes from commandsCompiler in real environment , see test/file validations for more information
    const presence_to_verify = {
      student_id: "Mariana",
      enter_hour: "10:00",
      left_hour: "15:00",
      room: "R100",
      day: 5,
    };
    const validation_result = new Presence(
      presence_to_verify.room,
      presence_to_verify.student_id,
      presence_to_verify.enter_hour,
      presence_to_verify.left_hour,
      presence_to_verify.day
    ).isValidPresence([], []);
    // Should got error because Student wasn't registered with Student command
    expect(validation_result).to.equal(ERROR_DICTIONARY.STUDENT_NOT_REGISTERED);
  });
});

describe("Use case when the enter hour value in Presence command, is greather than left hour", () => {
  it("10:00 enter hour , 08:00 left hour : should return ENTER_GREATHER_THAN_LEFT from error dictionary utility", async () => {
    //this comes from commandsCompiler in real environment , see test/file validations for more information
    const students = [];
    students["Mariana"] = []; // We initialize the students array to avoid the student_not_registered error
    const presence_to_verify = {
      student_id: "Mariana",
      enter_hour: "10:00",
      left_hour: "08:00",
      room: "R100",
      day: 5,
    };
    const validation_result = new Presence(
      presence_to_verify.room,
      presence_to_verify.student_id,
      presence_to_verify.enter_hour,
      presence_to_verify.left_hour,
      presence_to_verify.day
    ).isValidPresence(students, []);
    // Should got error because enter hour is greater than left hour
    expect(validation_result).to.equal(
      ERROR_DICTIONARY.ENTER_GREATHER_THAN_LEFT
    );
  });
});

describe("Use case when the enter hour value difference with left hour in Presence command, is fewer than 5 minutes", () => {
  it("10:00 enter hour , 10:04 left hour : should return DIFF_NOT_ENOUGH from error dictionary utility", async () => {
    //this comes from commandsCompiler in real environment , see test/file validations for more information
    const students = [];
    students["Mariana"] = []; // We initialize the students array to avoid the student_not_registered error
    const presence_to_verify = {
      student_id: "Mariana",
      enter_hour: "10:00",
      left_hour: "10:04",
      room: "R100",
      day: 5,
    };
    const validation_result = new Presence(
      presence_to_verify.room,
      presence_to_verify.student_id,
      presence_to_verify.enter_hour,
      presence_to_verify.left_hour,
      presence_to_verify.day
    ).isValidPresence(students, []);
    // Should got error because enter hour difference with left hour is fewer than 5 minutes
    expect(validation_result).to.equal(ERROR_DICTIONARY.DIFF_NOT_ENOUGH);
  });
});
