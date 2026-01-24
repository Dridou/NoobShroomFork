import crypto from "crypto";

const SECRET = process.env.ANON_ID_SECRET || "default-secret-change-me-in-production";
const COOKIE_NAME = "anonId";
const COOKIE_MAX_AGE = 31536000; // 1 year in seconds

/**
 * Generate a new anonymous ID (UUID v4)
 */
export function generateAnonId() {
  return crypto.randomUUID();
}

/**
 * Sign an anonId with HMAC-SHA256
 * Returns format: "anonId.signature"
 */
export function signAnonId(anonId) {
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(anonId)
    .digest("base64url");
  return `${anonId}.${signature}`;
}

/**
 * Verify a signed anonId cookie
 * Returns the anonId if valid, null if invalid
 */
export function verifyAnonIdCookie(cookieValue) {
  if (!cookieValue || typeof cookieValue !== "string") {
    return null;
  }

  const parts = cookieValue.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [anonId, signature] = parts;

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(anonId)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  return anonId;
}

/**
 * Get or create anonId from cookies
 * Returns a signed anonId cookie value
 */
export function getOrCreateAnonId(cookies) {
  // Try to get existing cookie
  const existing = cookies.get(COOKIE_NAME);

  if (existing) {
    const verified = verifyAnonIdCookie(existing.value);
    if (verified) {
      return {
        anonId: verified,
        cookieValue: existing.value,
        isNew: false,
      };
    }
  }

  // Create new anonId
  const newAnonId = generateAnonId();
  const signedValue = signAnonId(newAnonId);

  return {
    anonId: newAnonId,
    cookieValue: signedValue,
    isNew: true,
  };
}

/**
 * Set anonId cookie on response
 */
export function setAnonIdCookie(response, signedValue) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: signedValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}
