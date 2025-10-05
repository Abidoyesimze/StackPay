import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const address3 = accounts.get("wallet_3")!;

describe("Fee Collection Contract Tests", () => {
  beforeEach(() => {
    // Reset to a clean state for each test
    simnet.mineEmptyBlock();
  });

  describe("Contract Initialization", () => {
    it("should initialize with correct default values", () => {
      const { result } = simnet.callReadOnlyFn("fee-collection", "get-config", [], address1);
      expect(result).toBeOk();
      
      const config = result.value;
      expect(config.data.base-fee-rate).toBeUint(250); // 2.5%
      expect(config.data.contract-paused).toBeBool(false);
    });

    it("should return correct revenue statistics", () => {
      const { result } = simnet.callReadOnlyFn("fee-collection", "get-revenue-stats", [], address1);
      expect(result).toBeOk();
      
      const stats = result.value;
      expect(stats.data.total-collected).toBeUint(0);
      expect(stats.data.total-distributed).toBeUint(0);
      expect(stats.data.platform-revenue).toBeUint(0);
    });
  });

  describe("View Functions", () => {
    it("should check if contract is paused", () => {
      const { result: notPaused } = simnet.callReadOnlyFn("fee-collection", "is-paused", [], address1);
      expect(notPaused.value).toBeBool(false);
    });

    it("should return pending distributions count", () => {
      const { result: pending } = simnet.callReadOnlyFn("fee-collection", "get-pending-distributions", [], address1);
      expect(pending.value).toBeUint(0);
    });

    it("should return distribution addresses", () => {
      const { result: addresses } = simnet.callReadOnlyFn("fee-collection", "get-distribution-addresses", [], address1);
      expect(addresses).toBeOk();
    });

    it("should calculate fees correctly", () => {
      const { result: fee } = simnet.callReadOnlyFn("fee-collection", "preview-fee", [100000000, address2], address1);
      expect(fee.value).toBeUint(2500000); // 2.5% of 0.1 BTC
    });

    it("should return fee tier information", () => {
      const { result: basicTier } = simnet.callReadOnlyFn("fee-collection", "get-fee-tier-info", [0], address1);
      expect(basicTier.value.data.tier).toBeUint(0);
      expect(basicTier.value.data.rate).toBeUint(250);
      expect(basicTier.value.data.name).toBeUtf8("Basic");
    });
  });

  describe("Contract State", () => {
    it("should have correct initial state", () => {
      const { result: stats } = simnet.callReadOnlyFn("fee-collection", "get-revenue-stats", [], address1);
      expect(stats.value.data.total-collected).toBeUint(0);
      expect(stats.value.data.total-distributed).toBeUint(0);
    });
  });
});