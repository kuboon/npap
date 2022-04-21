import { EncData } from "./types.ts";
import {
  decryptByPrivateKey,
  encryptByPublicKey,
  UnwrapKeyError,
} from "./crypto.ts";
import { msgpack } from "./deps.ts";
const { decode, encode } = msgpack;

export class CryptoPackError extends Error {}
export function encryptBuffer(jwk: CryptoKey, plain: ArrayBuffer) {
  return encryptByPublicKey(jwk, plain).then(encode).catch((e: Error) => {
    let msg: string;
    if (
      e instanceof DOMException && e.message.startsWith('The JWK member "n"')
    ) {
      msg = "暗号化ページのURLが破損しています。";
    } else {
      console.error(e);
      msg = "不明な暗号化エラーが発生: " + e.message;
    }
    throw new CryptoPackError(msg, e);
  });
}
export function decryptBuffer(jwk: CryptoKey, encoded: ArrayBuffer) {
  const data = decode(encoded) as EncData;
  return decryptByPrivateKey(jwk, data).catch((e: Error) => {
    let msg: string;
    if (e instanceof RangeError) {
      // msgpack failed
      msg = "暗号化ファイルではありません";
    }
    if (e instanceof UnwrapKeyError) {
      msg = "鍵が整合しません。暗号化ページと秘密鍵ページが対応しているかご確認ください。";
    } else {
      console.error(e);
      msg = "不明な復号エラーが発生: " + e.message;
    }
    throw new CryptoPackError(msg, e);
  });
}
