import React from "react";

export const layout = "layout.page.tsx";

export default function Npap({ comp }: any) {
  return (
    <>
      <div id="app"></div>
      <script type='module' dangerouslySetInnerHTML={{ __html: comp.script() }} />
    </>
  );
}
