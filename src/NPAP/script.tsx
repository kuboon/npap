/// <reference lib="dom" />
import { missingFeature } from "../_lib/crypto.ts";
import { Instruction, Receive, Send } from "../_pages/mod.ts";
import { React, ReactDOM } from "../_lib/deps.ts";

const missing = missingFeature();
function Npap() {
  if (missing) {
    if (location.protocol !== "https:") {
      return (
        <p>ブラウザの暗号化機能を利用するために https が必須です。</p>
      );
    }
    return (
      <p>
        お使いのブラウザはNPAPに対応しておりません。 セキュリティ確保のためにも最新のブラウザをご利用ください。<br />
        不足機能: {missing}
      </p>
    );
  }
  const version = "1.1";
  const [hash, setHash] = React.useState(location.hash.slice(1));
  addEventListener("hashchange", () => setHash(location.hash.slice(1)));

  return (
    <div id="npap">
      <Pages urlString={hash} />
      <footer>
        <a href="#" target="_blank">
          鍵生成ページ
        </a>
        <a href="https://npap.kbn.one" target="_blank">
          NPAP Top
        </a>
        <span>Version {version}</span>
      </footer>
    </div>
  );
}

function Pages({ urlString }: { urlString: string }) {
  const params = Object.fromEntries(new URLSearchParams(urlString));
  if (params.send_to) {
    const { send_to, ...pub } = params;
    return <Send sendTo={send_to} pub={pub} />;
  }
  if (params.receive_by) {
    const { receive_by, ...secrets } = params;
    return <Receive receiveBy={receive_by} secrets={secrets} />;
  }
  return <Instruction />;
}
ReactDOM.render(<Npap />, document.getElementById("app"));
