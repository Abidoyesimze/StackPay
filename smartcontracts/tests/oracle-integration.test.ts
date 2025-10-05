import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const address3 = accounts.get("wallet_3")!;

describe("Oracle Integration Contract Tests", () => {
  beforeEach(() => {
    // Reset to a clean state for each test
    simnet.mineEmptyBlock();
  });

  describe("View Functions", () => {
    it("should return BTC price", () => {
      const { result } = simnet.callReadOnlyFn("oracle-integration", "get-btc-price", [], address1);
      expect(result).toBeOk();
    });

    it("should convert BTC to USD", () => {
      const { result } = simnet.callReadOnlyFn("oracle-integration", "btc-to-usd", [100000000], address1);
      expect(result).toBeOk();
    });

    it("should convert USD to BTC", () => {
      const { result } = simnet.callReadOnlyFn("oracle-integration", "usd-to-btc", [100000], address1);
      expect(result).toBeOk();
    });

    it("should return weighted price", () => {
      const { result } = simnet.callReadOnlyFn("oracle-integration", "get-weighted-price", [], address1);
      expect(result).toBeOk();
    });

    it("should return price with confidence", () => {
      const { result } = simnet.callReadOnlyFn("oracle-integration", "get-price-with-confidence", [], address1);
      expect(result).toBeOk();
    });

    it("should return oracle stats", () => {
      const { result } = simnet.callReadOnlyFn("oracle-integration", "get-oracle-stats", [], address1);
      expect(result).toBeOk();
    });

    it("should check if price is fresh", () => {
      const { result } = simnet.callReadOnlyFn("oracle-integration", "is-price-fresh", [], address1);
      expect(result.value).toBeBool(false); // Initially not fresh
    });
  });

  describe("Contract State", () => {
    it("should have correct initial state", () => {
      const { result: stats } = simnet.callReadOnlyFn("oracle-integration", "get-oracle-stats", [], address1);
      expect(stats.value.data.total-price-updates).toBeUint(0);
    });
  });
});