export const layout = "layout.page.tsx";

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
