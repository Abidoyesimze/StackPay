import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const address3 = accounts.get("wallet_3")!;

describe("Merchant Registry Contract Tests", () => {
  beforeEach(() => {
    // Reset to a clean state for each test
    simnet.mineEmptyBlock();
  });

  describe("Contract Initialization", () => {
    it("should initialize with correct default values", () => {
      const { result } = simnet.callReadOnlyFn("merchant-registry", "get-registry-stats", [], address1);
      expect(result).toBeOk();
      
      const stats = result.value;
      expect(stats.data.total-merchants).toBeUint(0);
      expect(stats.data.verification-required).toBeBool(true);
      expect(stats.data.min-reputation-score).toBeUint(100);
    });
  });

  describe("View Functions", () => {
    it("should return registry statistics", () => {
      const { result } = simnet.callReadOnlyFn("merchant-registry", "get-registry-stats", [], address1);
      expect(result).toBeOk();
      
      const stats = result.value;
      expect(stats.data.total-merchants).toBeUint(0);
      expect(stats.data.verification-required).toBeBool(true);
    });

    it("should return none for non-existent merchant", () => {
      const { result } = simnet.callReadOnlyFn("merchant-registry", "get-merchant", [address2], address1);
      expect(result.value).toBeNone();
    });

    it("should return none for non-existent merchant metadata", () => {
      const { result } = simnet.callReadOnlyFn("merchant-registry", "get-merchant-metadata", [address2], address1);
      expect(result.value).toBeNone();
    });

    it("should return none for non-existent merchant limits", () => {
      const { result } = simnet.callReadOnlyFn("merchant-registry", "get-merchant-limits", [address2], address1);
      expect(result.value).toBeNone();
    });

    it("should return merchant tier for non-existent merchant", () => {
      const { result } = simnet.callReadOnlyFn("merchant-registry", "get-merchant-tier", [address2], address1);
      expect(result.value).toBeUint(0); // Default tier
    });
  });

  describe("Contract State", () => {
    it("should have correct initial state", () => {
      const { result } = simnet.callReadOnlyFn("merchant-registry", "get-registry-stats", [], address1);
      expect(result.value.data.total-merchants).toBeUint(0);
      expect(result.value.data.verification-required).toBeBool(true);
      expect(result.value.data.min-reputation-score).toBeUint(100);
    });
  });
});