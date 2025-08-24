describe("basic math", () => {
    it("2 + 3 should equal 5", () => {
        expect(2 + 3).toBe(5);
    });

    it("5 - 2 should equal 3", () => {
        expect(5 - 2).toBe(3);
    });
});

describe("string checks", () => {
    it("should contain word hello", () => {
        expect("hello world").toContain("hello");
    });

    it("should match regex", () => {
        expect("typescript").toMatch(/script/);
    });
});
