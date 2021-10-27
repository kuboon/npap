import { CryptoPackError, decryptBuffer, encryptBuffer } from "./cryptoPack.ts";

export async function encryptFileAndGetResultNode(
  jwk: JsonWebKey,
  file: File,
  filename: string,
) {
  const plain = await readAsArrayBuffer(file);
  const retElem = document.createElement("p");
  return encryptBuffer(jwk, plain).then((encoded) => {
    const a = arrayBufferToDownloadAnchor(encoded, filename);
    retElem.insertAdjacentElement("afterbegin", a);
    return retElem;
  }).catch((err: CryptoPackError) => {
    let msg = file.name + ": " + err.message;
    retElem.insertAdjacentText("afterbegin", msg);
    return retElem;
  });
}
export async function decryptFileAndGetResultNode(jwk: JsonWebKey, file: File) {
  const encoded = await readAsArrayBuffer(file);
  const retElem = document.createElement("p");
  return decryptBuffer(jwk, encoded).then((plain) => {
    const filename = file.name
      .split(".")
      .slice(0, -2)
      .join(".");
    const a = arrayBufferToDownloadAnchor(plain, filename);
    retElem.insertAdjacentElement("afterbegin", a);
    return retElem;
  }).catch((err: CryptoPackError) => {
    let msg = file.name + ": " + err.message;
    retElem.insertAdjacentText("afterbegin", msg);
    return retElem;
  });
}
const readAsArrayBuffer = async (file: File) =>
  new Promise<ArrayBuffer>((ok, ng) => {
    const reader = new FileReader();
    reader.onload = () => ok(reader.result as ArrayBuffer);
    reader.onerror = ng;
    reader.readAsArrayBuffer(file);
  });
function arrayBufferToObjectUrl(buf: ArrayBuffer) {
  const blob = new Blob([buf], { type: "application/octet-stream" });
  return URL.createObjectURL(blob);
}
function arrayBufferToDownloadAnchor(buf: ArrayBuffer, filename: string) {
  const link = document.createElement("a");
  link.href = arrayBufferToObjectUrl(buf);
  link.download = filename;
  link.style.display = "inline";
  link.text = link.download;
  return link;
}
