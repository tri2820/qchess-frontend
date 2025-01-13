import { For, onMount, Show } from "solid-js";
import GameEndedBanner from "~/components/GameEndedBanner";
import PieceImg from "~/components/PieceImg";
import Square from "~/components/Square";
import { capturedPieces, flow } from "~/signals";

const squares = Array(64).fill(null);

export default function Home() {
  onMount(async () => {
    // try {
    //   const backend_url = import.meta.env.DEV
    //     ? import.meta.env.VITE_BACKEND_URL_DEV
    //     : import.meta.env.VITE_BACKEND_URL_PROD;
    //   const response = await fetch(backend_url);
    //   const data = await response.json();
    //   console.log(data);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  });

  const capturedBlacks = () =>
    capturedPieces().filter((p) => p.color == "black");
  const capturedWhites = () =>
    capturedPieces().filter((p) => p.color == "white");

  return (
    <div class="h-screen flex items-center justify-center">
      <GameEndedBanner />

      <div class="relative">
        <div class="absolute top-0 left-0 bottom-0 -translate-x-full flex flex-col">
          <div class=" flex-1 flex max-w-72 flex-wrap">
            <For each={capturedWhites()}>
              {(p) => <PieceImg size="sm" piece={p} />}
            </For>
          </div>
          <div class=" flex-1 flex max-w-72 flex-wrap-reverse">
            <For each={capturedBlacks()}>
              {(p) => <PieceImg size="sm" piece={p} />}
            </For>
          </div>
        </div>

        <div
          class="text-center bg-black text-white py-1 mb-2 invisible data-[show=true]:visible"
          data-show={flow() == "turn-black"}
        >
          black's turn
        </div>

        <div class="bg-white border flex-1  grid grid-cols-8">
          <For each={squares}>{(_, i) => <Square i={i()} />}</For>
        </div>

        <div
          class="text-center bg-white text-black py-1 mb-2 invisible data-[show=true]:visible"
          data-show={flow() == "turn-white"}
        >
          white's turn
        </div>
      </div>
    </div>
  );
}
