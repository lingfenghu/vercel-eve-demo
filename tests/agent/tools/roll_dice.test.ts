import assert from "node:assert/strict";
import test from "node:test";
import { rollDice } from "../../../agent/tools/roll_dice.ts";

// 固定随机数，保证每次测试结果一致，并覆盖六个点数及上下边界。
const cases = [
  { random: 0, expected: 1 },
  { random: 1 / 6, expected: 2 },
  { random: 2 / 6, expected: 3 },
  { random: 3 / 6, expected: 4 },
  { random: 4 / 6, expected: 5 },
  { random: 1 - Number.EPSILON, expected: 6 },
];

for (const { random, expected } of cases) {
  test(`roll_dice returns ${expected} for Math.random() = ${random}`, async (t) => {
    t.mock.method(Math, "random", () => random);

    assert.deepEqual(await rollDice(), { num: expected });
  });
}
