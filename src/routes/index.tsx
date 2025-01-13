import { For, onMount } from "solid-js";
import Square from "~/components/Square";

const squares = Array(64).fill(null);

export default function Home() {
  onMount(async () => {
    try {
      const backend_url = import.meta.env.DEV
        ? import.meta.env.VITE_BACKEND_URL_DEV
        : import.meta.env.VITE_BACKEND_URL_PROD;
      const response = await fetch(backend_url);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  return (
    <div class="h-screen flex items-center justify-center">
      {/* <div>{JSON.stringify(highlightValidMoves())}</div> */}
      <div class="bg-white border   grid grid-cols-8">
        <For each={squares}>{(_, i) => <Square i={i()} />}</For>
      </div>
    </div>
  );
}
