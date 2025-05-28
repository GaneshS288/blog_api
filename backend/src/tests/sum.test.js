import sum from "../sum.ts"
import { test, expect } from "vitest";

test("sums numbers", () => {
    const result = sum(2, 4);
    expect(result).toBe(6);
})