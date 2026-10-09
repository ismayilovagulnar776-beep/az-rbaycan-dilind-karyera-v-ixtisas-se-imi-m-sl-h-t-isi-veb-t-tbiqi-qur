import { describe, expect, it } from "vitest";
import { parseFeedback, resolveModel, DEFAULT_MODEL } from "@/lib/feedback-schema";

const valid = {
  summary: "Səhv",
  steps: ["Addım 1", "Addım 2"],
  tip: "Məsləhət",
  practice: { question: "3x + 3 = 12?", options: ["1", "2", "3", "4"], hint: "İpucu" },
};

describe("parseFeedback", () => {
  it("accepts a valid response", () => {
    expect(parseFeedback(JSON.stringify(valid))?.steps).toHaveLength(2);
  });
  it("rejects a practice question without exactly 4 options", () => {
    expect(parseFeedback(JSON.stringify({ ...valid, practice: { ...valid.practice, options: ["1", "2"] } }))).toBeNull();
  });
  it("rejects non-JSON text", () => {
    expect(parseFeedback("Salam")).toBeNull();
  });
});

describe("resolveModel", () => {
  it("uses a supported configured model", () => {
    expect(resolveModel("openai/gpt-5-mini")).toBe("openai/gpt-5-mini");
  });
  it("falls back to the default for unsupported models", () => {
    expect(resolveModel("some/unknown-model")).toBe(DEFAULT_MODEL);
  });
});
