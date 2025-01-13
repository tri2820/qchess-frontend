import katex from "katex";
import { createEffect, For, Show } from "solid-js";
import GameEndedBanner from "~/components/GameEndedBanner";
import PieceImg from "~/components/PieceImg";
import Square from "~/components/Square";
import {
  capturedPieces,
  flow,
  pickAnother,
  selectedCircuitLatex,
  selectedPiece,
  setDidAction,
} from "~/signals";

export default function Home() {
  return <div>OK</div>;
  // const squares = Array(64).fill(null);
  // let latexEl!: HTMLDivElement;

  // const capturedBlacks = () =>
  //   capturedPieces().filter((p) => p.color == "black");
  // const capturedWhites = () =>
  //   capturedPieces().filter((p) => p.color == "white");

  // createEffect(() => {
  //   const _ = flow();
  //   setDidAction(false);
  // });

  // createEffect(() => {
  //   const p = selectedPiece();
  //   const latex = selectedCircuitLatex();
  //   katex.render(
  //     latex ?? (p ? (p.color == "black" ? "|0\\rangle" : "|1\\rangle") : ""),
  //     latexEl,
  //     {
  //       throwOnError: false,
  //     }
  //   );
  // });

  // return (
  //   <div class="h-screen flex items-center  flex-col space-y-4">
  //     <div class="text-center pt-8 space-y-1">
  //       <div class="text-2xl font-bold">QChess</div>
  //       <div class="text-sm">A game about superposition and loyalty</div>
  //     </div>

  //     <div class="h-4">
  //       <div ref={latexEl}></div>
  //     </div>

  //     <div class="relative">
  //       <div class="absolute top-0 left-0 bottom-0 -translate-x-full flex flex-col">
  //         <div class=" flex-1 flex max-w-72 flex-wrap">
  //           <For each={capturedWhites()}>
  //             {(p) => <PieceImg size="sm" piece={p} />}
  //           </For>
  //         </div>
  //         <div class=" flex-1 flex max-w-72 flex-wrap-reverse">
  //           <For each={capturedBlacks()}>
  //             {(p) => <PieceImg size="sm" piece={p} />}
  //           </For>
  //         </div>
  //       </div>

  //       <div
  //         class="text-center bg-black text-white py-1 invisible data-[show=true]:visible"
  //         data-show={flow() == "turn-black"}
  //       >
  //         black's turn
  //       </div>

  //       <div class="bg-white  flex-1  grid grid-cols-8 relative">
  //         <GameEndedBanner />
  //         <For each={squares}>{(_, i) => <Square i={i()} />}</For>
  //       </div>

  //       <div
  //         class="text-center bg-white text-black py-1 invisible data-[show=true]:visible"
  //         data-show={flow() == "turn-white"}
  //       >
  //         white's turn
  //       </div>

  //       <Show when={pickAnother()}>
  //         <div class="text-center py-2">Pick CNOT's target qubit</div>
  //       </Show>
  //     </div>
  //   </div>
  // );
}
