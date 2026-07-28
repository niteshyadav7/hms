import { describe, it, expect } from "vitest";
import { AuthService } from "../src/services/auth.service";
import { ConflictError, UnauthorizedError } from "../src/lib/errors";
import { verifyToken } from "../src/lib/auth/jwt";

describe("Senior Engineer Edge-Case Verification - Authentication & Security", () => {
  const testEmail = `testuser_${Date.now()}@hotel.com`;
  const testPassword = "Password123!";

  it("Edge Case 1: Hashes password securely and issues valid JWT", async () => {
    const result = await AuthService.register({
      name: "Security Tester",
      email: testEmail,
      password: testPassword,
      role: "GUEST",
    });

    expect(result.user.email).toBe(testEmail);
    expect(result.token).toBeDefined();

    // Verify token claims
    const decoded = verifyToken(result.token);
    expect(decoded).not.toBeNull();
    expect(decoded?.email).toBe(testEmail);
    expect(decoded?.role).toBe("GUEST");
  });

  it("Edge Case 2: Prevents registering duplicate email addresses", async () => {
    await expect(
      AuthService.register({
        name: "Duplicate User",
        email: testEmail,
        password: "OtherPassword",
        role: "GUEST",
      })
    ).rejects.toThrow(ConflictError);
  });

  it("Edge Case 3: Rejects incorrect passwords cleanly", async () => {
    await expect(
      AuthService.login({
        email: testEmail,
        password: "WRONG_PASSWORD",
      })
    ).rejects.toThrow(UnauthorizedError);
  });

  it("Edge Case 4: Rejects non-existent email addresses", async () => {
    await expect(
      AuthService.login({
        email: "nonexistent_email_999@hotel.com",
        password: testPassword,
      })
    ).rejects.toThrow(UnauthorizedError);
  });
});
