import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const address3 = accounts.get("wallet_3")!;

describe("Payment Escrow Contract Tests", () => {
  beforeEach(() => {
    // Reset to a clean state for each test
    simnet.mineEmptyBlock();
  });

  describe("View Functions", () => {
    it("should return payment settings", () => {
      const { result } = simnet.callReadOnlyFn("payment-escrow", "get-settings", [], address1);
      expect(result).toBeOk();
    });

    it("should return payment stats", () => {
      const { result } = simnet.callReadOnlyFn("payment-escrow", "get-payment-stats", [], address1);
      expect(result).toBeOk();
    });

    it("should return none for non-existent payment", () => {
      const { result } = simnet.callReadOnlyFn("payment-escrow", "get-payment", [1], address1);
      expect(result.value).toBeNone();
    });

    it("should return none for non-existent payment state", () => {
      const { result } = simnet.callReadOnlyFn("payment-escrow", "get-payment-state", [1], address1);
      expect(result.value).toBeNone();
    });

    it("should check if merchant is authorized", () => {
      const { result } = simnet.callReadOnlyFn("payment-escrow", "is-merchant-authorized", [address2], address1);
      expect(result.value).toBeBool(false); // Initially not authorized
    });
  });

  describe("Contract State", () => {
    it("should have correct initial state", () => {
      const { result: stats } = simnet.callReadOnlyFn("payment-escrow", "get-payment-stats", [], address1);
      expect(stats.value.data.total-payments).toBeUint(0);
      expect(stats.value.data.total-volume).toBeUint(0);
    });
  });
});