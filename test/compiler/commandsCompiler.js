// TEST FOR VALIDATING THE VALUES RETURNED BY THE COMPILER WHEN A COMMAND FORMATTED STRUCTURE IS SENT

import { expect } from "chai";
import {
  calculateDays,
  compileCommands,
} from "../../tools/commandsCompiler.js";

describe("Real use case, a single Presence register with presence days 5,2,2,6", () => {
  it("Should return total of 3 days listed. (Student attended twice or more times the second day)", () => {
    const presences = [
      {
        day: 5,
        enter_hour: "08:00",
        left_hour: "11:00",
        room: "R980",
      },
      {
        day: 2,
        enter_hour: "08:00",
        left_hour: "11:00",
        room: "R980",
      },
      {
        day: 2,
        enter_hour: "08:00",
        left_hour: "11:00",
        room: "R980",
      },
      {
        day: 6,
        enter_hour: "08:00",
        left_hour: "11:00",
        room: "R980",
      },
    ];
    const different_days = [];
    presences.forEach((presence) => {
      calculateDays(presence, different_days);
    });
    expect(different_days.length).to.equals(3);
  });
});

describe("Real use case, a single Presence register from 08:00 to 11:00", () => {
  it("Should return total minute presence of 180 minutes.", () => {
    const presence = {
      day: 5,
      enter_hour: "08:00",
      left_hour: "11:00",
      room: "R980",
    };
    const minutes_single_presence = calculateDays(presence, []); // pass an empty array to avoid different days of Presences check;
    expect(minutes_single_presence).to.equals(minutes_single_presence);
  });
});

describe("Real use case, multiple presences of 20, 40 and 60 minutes within 3 days", () => {
  it("Should return total minute presence 120 minutes and 3 different Presence days.", () => {
    const presences = [
      {
        day: 5,
        enter_hour: "08:00",
        left_hour: "08:20",
        room: "R980",
      },
      {
        day: 2,
        enter_hour: "10:00",
        left_hour: "10:40",
        room: "R980",
      },
      {
        day: 4,
        enter_hour: "11:00",
        left_hour: "12:00",
        room: "R980",
      },
    ];
    const different_days = [];
    let attendance_minutes = 0;
    presences.forEach((presence) => {
      attendance_minutes += calculateDays(presence, different_days);
    });
    expect(attendance_minutes).to.equals(120);
    expect(different_days.length).to.equals(3);
  });
});

describe("Real use case, when a valid file with correct format is passed, but its content is empty", () => {
  it("Should return an empty array with processed presences and discarded commands.", async () => {
    const processed_commands = {
      students_presence: [],
      discarded: [],
    };
    const { processed_presences, discarded } = await compileCommands(
      processed_commands
    );
    expect(processed_presences.length).to.equals(0);
    expect(discarded.length).to.equals(0);
  });
});

describe("Real use case, Student Marco is the one who has more Presence minutes, Diego is the second one and Maria is the third one", () => {
  it("Should return a sorted array containing the final result of the student in the order : Marco,Diego,Maria (no matter of the initial array order)", async () => {
    const processed_commands = {
      students_presence: {
        Maria: [
          {
            day: 1,
            enter_hour: "08:00",
            left_hour: "09:00",
            room: "R751",
          },
        ],
        Diego: [
          {
            day: 1,
            enter_hour: "08:00",
            left_hour: "10:00",
            room: "R751",
          },
        ],
        Marco: [
          {
            day: 1,
            enter_hour: "08:00",
            left_hour: "16:00",
            room: "R751",
          },
        ],
      },
      discarded: [],
    };
    const { processed_presences, discarded } = await compileCommands(
      processed_commands
    );
    expect(processed_presences[0].includes("Marco")).to.equals(true);
    expect(processed_presences[1].includes("Diego")).to.equals(true);
    expect(processed_presences[2].includes("Maria")).to.equals(true);
  });
});
