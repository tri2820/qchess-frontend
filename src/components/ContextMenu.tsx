import { Accessor, onCleanup, onMount, Setter, Show } from "solid-js";
import { didAction, Gate } from "~/signals";

export default function ContextMenu(props: {
  showContextMenu: Accessor<any>;
  setShowContextMenu: Setter<any>;
  onItemClick: (gate: Gate) => void;
}) {
  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".context-menu")) {
        props.setShowContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
    });
    // props.setShowContextMenu(false);
  });
  return (
    <div
      class="context-menu fixed z-50"
      style={{
        left: `${props.showContextMenu().left}px`,
        top: `${props.showContextMenu().top}px`,
      }}
    >
      <div class="border bg-white w-48 rounded drop-shadow-lg flex flex-col items-stretch">
        <Show
          when={didAction()}
          fallback={
            <>
              <button
                class="menu-item"
                onClick={() => {
                  props.onItemClick("h");
                }}
              >
                Hadamard
              </button>
              <button
                class="menu-item"
                onClick={() => {
                  props.onItemClick("cx");
                }}
              >
                CNOT
              </button>
              <button
                class="menu-item"
                onClick={() => {
                  props.onItemClick("x");
                }}
              >
                X gate
              </button>
              <button
                class="menu-item"
                onClick={() => {
                  props.onItemClick("y");
                }}
              >
                Y gate
              </button>
              <button
                class="menu-item"
                onClick={() => {
                  props.onItemClick("z");
                }}
              >
                Z gate
              </button>

              <div class="h-[1px] border-b" />
              <button
                class="menu-item"
                onClick={() => {
                  props.onItemClick("measure");
                }}
              >
                Measure
              </button>
            </>
          }
        >
          <div class="p-4">
            You have already played a quantum action this turn!
          </div>
        </Show>
      </div>
    </div>
  );
}
