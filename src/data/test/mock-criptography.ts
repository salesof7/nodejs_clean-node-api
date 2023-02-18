import { Hasher } from "@/data/protocols/cryptograph/hasher";
import { Decrypter } from "@/data/protocols/cryptograph/decrypter";
import { Encrypter } from "@/data/protocols/cryptograph/encrypter";
import { HashComparer } from "@/data/protocols/cryptograph/hash-comparer";

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return await Promise.resolve("hashed_password");
    }
  }
  return new HasherStub();
};

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return await Promise.resolve("any_value");
    }
  }
  return new DecrypterStub();
};

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve("any_token");
    }
  }
  return new EncrypterStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};
