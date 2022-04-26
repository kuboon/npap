import React from "react";

export const layout = "layout.page.tsx";
interface HTMLScriptElement {
  inline: boolean;
}

export default function Npap() {
  return (
    <>
      <div id="app"></div>
      <script
        type="module"
        src="script.js"
        /* @ts-expect-error */
        inline="1"
      />
    </>
  );
}
