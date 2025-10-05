import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const address3 = accounts.get("wallet_3")!;

describe("Treasury Contract Tests", () => {
  beforeEach(() => {
    // Reset to a clean state for each test
    simnet.mineEmptyBlock();
  });

  describe("Contract Initialization", () => {
    it("should initialize with correct default values", () => {
      const { result } = simnet.callReadOnlyFn("treasury", "get-treasury-config", [], address1);
      expect(result).toBeOk();
      
      const config = result.value;
      expect(config.data.required-signatures).toBeUint(2);
      expect(config.data.emergency-mode).toBeBool(false);
    });
  });

  describe("View Functions", () => {
    it("should return treasury configuration", () => {
      const { result } = simnet.callReadOnlyFn("treasury", "get-treasury-config", [], address1);
      expect(result).toBeOk();
    });

    it("should return treasury balance", () => {
      const { result } = simnet.callReadOnlyFn("treasury", "get-treasury-balance", [], address1);
      expect(result).toBeOk();
    });

    it("should return none for non-existent proposal", () => {
      const { result } = simnet.callReadOnlyFn("treasury", "get-proposal", [1], address1);
      expect(result.value).toBeNone();
    });

    it("should return none for non-existent proposal vote", () => {
      const { result } = simnet.callReadOnlyFn("treasury", "get-proposal-vote", [1, address2], address1);
      expect(result.value).toBeNone();
    });

    it("should check if principal is signer", () => {
      const { result } = simnet.callReadOnlyFn("treasury", "is-signer", [address2], address1);
      expect(result.value).toBeBool(false); // Initially not a signer
    });

    it("should return signer weight", () => {
      const { result } = simnet.callReadOnlyFn("treasury", "get-signer-weight", [address2], address1);
      expect(result.value).toBeUint(0); // Initially no weight
    });
  });

  describe("Contract State", () => {
    it("should have correct initial state", () => {
      const { result: config } = simnet.callReadOnlyFn("treasury", "get-treasury-config", [], address1);
      expect(config.value.data.emergency-mode).toBeBool(false);
      expect(config.value.data.required-signatures).toBeUint(2);
    });
  });
});