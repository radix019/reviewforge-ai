import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { FakeUserRespository } from "../../repositories/user.repository";
import { AuthService } from "../../services/auth.service";
import * as jwtUtils from "../../utils/jwt";
import { hashPassword } from "../../utils/password";

describe("AuthService", () => {
  let repository: FakeUserRespository;
  let service: AuthService;

  beforeEach(() => {
    repository = new FakeUserRespository();
    service = new AuthService(repository);
    vi.spyOn(jwtUtils, "generateAccessToken").mockReturnValue("test-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers a new user and returns an access token", async () => {
    const result = await service.register(
      "Rahul",
      "rahul@gmail.com",
      "Password123",
    );

    expect(result).toEqual({ accessToken: "test-token" });
  });

  it("throws when the user already exists", async () => {
    vi.spyOn(repository, "findByEmail").mockResolvedValue({
      id: "1",
      name: "Rahul",
      email: "rahul@gmail.com",
      passwordHash: "existing-hash",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    await expect(
      service.register("Rahul", "rahul@gmail.com", "Password123"),
    ).rejects.toThrow("User already exist");
  });

  it("logs in an existing user with valid credentials", async () => {
    const passwordHash = await hashPassword("Password123");
    vi.spyOn(repository, "findByEmail").mockResolvedValue({
      id: "1",
      name: "Rahul",
      email: "rahul@gmail.com",
      passwordHash,
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await service.login("rahul@gmail.com", "Password123");
    expect(result).toEqual({ accessToken: "test-token" });
  });

  it("throws when login credentials are invalid", async () => {
    vi.spyOn(repository, "findByEmail").mockResolvedValue(null);

    await expect(
      service.login("wrong@example.com", "Password123"),
    ).rejects.toThrow("Invalid Credentials");
  });
});
