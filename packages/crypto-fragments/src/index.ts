export interface MaskedFragmentCipherContract {
  encryptFragment(plainText: string): Promise<string>;
  decryptFragment(cipherText: string): Promise<string>;
}
