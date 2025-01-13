import { Show } from "solid-js";
import { flow } from "~/signals";

export default function GameEndedBanner() {
  return (
    <Show when={flow() == "ended-black-win" || flow() == "ended-white-win"}>
      <div
        data-black={flow() === "ended-black-win"}
        class="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-50 bg-white data-[black=true]:bg-black px-8 py-4 border-4 drop-shadow border-black data-[black=true]:border-white text-black data-[black=true]:text-white
        flex flex-col items-center space-y-1"
      >
        <div class="text-4xl font-bold">
          {flow() === "ended-black-win" ? "Black Won" : "White Won"}
        </div>
        <button
          class="px-2 py-1 hover:underline"
          onClick={() => {
            window.location.reload();
          }}
        >
          Play Again
        </button>
      </div>
    </Show>
  );
}
