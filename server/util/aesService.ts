import dotenv from "dotenv";
import AesEncryption from "aes-encryption";
dotenv.config();

export class AesService {
  private static secretKey: string;
  private static aes: AesEncryption;

  static {
    const secretKey =
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    if (!secretKey || secretKey.length !== 64) {
      throw new Error("AES_SECRET_KEY must be 64 characters long");
    }

    this.secretKey = secretKey;
    this.aes = new AesEncryption();
    this.aes.setSecretKey(this.secretKey);
  }

  public static encrypt(text: string): string {
    return this.aes.encrypt(text);
  }

  public static decrypt(encryptedText: string): string {
    return this.aes.decrypt(encryptedText);
  }
}
