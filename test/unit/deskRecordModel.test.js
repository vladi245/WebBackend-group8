import { DeskRecordModel } from "../../models/DeskRecord.js";
import pool from "../../src/db.js";

// Mock DB
jest.mock("../../src/db.js", () => ({
  query: jest.fn()
}));


describe("DeskRecordModel.createDeskRecord", () => {
  it("inserts a new desk record and returns it", async () => {
    const fakeRecord = { desk_id: "1", user_id: "10", status: "standing", timestamp: new Date() };

    pool.query.mockResolvedValue({ rows: [fakeRecord] });

    const result = await DeskRecordModel.createDeskRecord("1", "10", "standing");

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO desk_records"),
      ["1", "10", "standing"]
    );
    expect(result).toEqual(fakeRecord);
  });

  it("returns null if insertion fails", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await DeskRecordModel.createDeskRecord("1", "10", "standing");

    expect(result).toBeNull();
  });
});

describe("DeskRecordModel.getDeskRecordsByUser", () => {
  it("retrieves records for a user within a date range", async () => {
    const fakeRecords = [
      { desk_id: "1", user_id: "10", status: "standing", timestamp: new Date("2025-12-01T09:00:00Z") },
      { desk_id: "1", user_id: "10", status: "sitting", timestamp: new Date("2025-12-01T10:00:00Z") }
    ];

    const startDate = new Date("2025-12-01T00:00:00Z");
    const endDate = new Date("2025-12-01T23:59:59Z");

    pool.query.mockResolvedValue({ rows: fakeRecords });

    const result = await DeskRecordModel.getDeskRecordsByUser("10", startDate, endDate);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM desk_records"),
      ["10", startDate, endDate]
    );
    expect(result).toEqual(fakeRecords);
  });

  it("returns empty array if no records found", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const startDate = new Date("2025-12-01T00:00:00Z");
    const endDate = new Date("2025-12-01T23:59:59Z");

    const result = await DeskRecordModel.getDeskRecordsByUser("10", startDate, endDate);

    expect(result).toEqual([]);
  });
});

describe("DeskRecordModel.getLatestDeskRecord", () => {
  it("returns the latest record for a user", async () => {
    const fakeRecord = { desk_id: "1", user_id: "10", status: "standing", timestamp: new Date() };

    pool.query.mockResolvedValue({ rows: [fakeRecord] });

    const result = await DeskRecordModel.getLatestDeskRecord("10");

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("ORDER BY timestamp DESC"),
      ["10"]
    );
    expect(result).toEqual(fakeRecord);
  });

  it("returns null if no records exist", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await DeskRecordModel.getLatestDeskRecord("10");

    expect(result).toBeNull();
  });
});

describe("DeskRecordModel.getWeeklyStandingStats", () => {
  // Mock getDeskRecordsByUser to control data
  const mockRecords = [
    { status: "standing", timestamp: new Date("2025-12-01T08:00:00Z") },
    { status: "sitting", timestamp: new Date("2025-12-01T10:00:00Z") },
    { status: "standing", timestamp: new Date("2025-12-02T09:00:00Z") },
    { status: "sitting", timestamp: new Date("2025-12-02T09:30:00Z") },
  ];

  beforeEach(() => {
    // Override getDeskRecordsByUser to return mock data
    DeskRecordModel.getDeskRecordsByUser = jest.fn().mockResolvedValue(mockRecords);

    // Mock current date for consistency
    jest.useFakeTimers().setSystemTime(new Date("2025-12-06T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("calculates weekly standing minutes correctly", async () => {
    const stats = await DeskRecordModel.getWeeklyStandingStats("10");

    expect(DeskRecordModel.getDeskRecordsByUser).toHaveBeenCalled();
    expect(stats).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ day: "Mon", minutes: 120 }),
        expect.objectContaining({ day: "Tue", minutes: 30 }),
      ])
    );
  });

  it("returns zero minutes for days without standing records", async () => {
    DeskRecordModel.getDeskRecordsByUser.mockResolvedValue([]);

    const stats = await DeskRecordModel.getWeeklyStandingStats("10");

    expect(stats.every(day => day.minutes === 0)).toBe(true);
  });
});
