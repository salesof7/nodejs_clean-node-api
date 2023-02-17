import { Hasher } from "@/data/protocols/cryptograph/hasher";
import { Decrypter } from "@/data/protocols/cryptograph/decrypter";
import { Encrypter } from "@/data/protocols/cryptograph/encrypter";
import { HashComparer } from "@/data/protocols/cryptograph/hash-comparer";

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve("hashed_password");
      });
    }
  }
  return new HasherStub();
};

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve("any_value");
      });
    }
  }
  return new DecrypterStub();
};

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve("any_token");
      });
    }
  }
  return new EncrypterStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return await new Promise((resolve) => {
        resolve(true);
      });
    }
  }
  return new HashComparerStub();
};
