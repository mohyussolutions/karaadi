import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_LENGTH = 32;
const SECRET = process.env.ENCRYPTION_KEY || "";
const KEY = Buffer.concat([Buffer.from(SECRET)], KEY_LENGTH);

export const EncryptionController = {
  encrypt(text: string): string {
    try {
      if (!text) return "";

      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");
      const authTag = cipher.getAuthTag().toString("hex");

      return `${iv.toString("hex")}:${authTag}:${encrypted}`;
    } catch (err) {
      console.error("CRITICAL ENCRYPTION ERROR:", err);
      throw err;
    }
  },

  decrypt(hash: string): string {
    try {
      if (!hash || typeof hash !== "string" || !hash.includes(":")) return hash;

      const [ivHex, tagHex, encrypted] = hash.split(":");

      if (!ivHex || !tagHex || !encrypted) return hash;

      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        KEY,
        Buffer.from(ivHex, "hex"),
      );

      decipher.setAuthTag(Buffer.from(tagHex, "hex"));

      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (err) {
      console.error("CRITICAL DECRYPTION ERROR:", err);
      return "Error decrypting content";
    }
  },
};
