import { EncData } from "./types.ts";
import {
  decryptByPrivateJwk,
  encryptByPublicJwk,
  UnwrapKeyError,
} from "./crypto.ts";
import { decode, encode } from "msgpack";

export class CryptoPackError extends Error {}
export async function encryptBuffer(jwk: JsonWebKey, plain: ArrayBuffer) {
  return encryptByPublicJwk(jwk, plain).then(encode).catch((e: any) => {
    // 暗号化は通常失敗しない
    console.error(e);
    const msg = "不明な復号エラーが発生: " + e.message;
    throw new CryptoPackError(msg, e);
  });
}
export async function decryptBuffer(jwk: JsonWebKey, encoded: ArrayBuffer) {
  const data = decode(encoded) as EncData;
  return decryptByPrivateJwk(jwk, data).catch((e: any) => {
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
