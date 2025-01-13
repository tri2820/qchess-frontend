import { batch, createSignal, onMount, Show, untrack } from "solid-js";
import {
  capturedPieces,
  Color,
  flow,
  Piece,
  pieces,
  selectedPiece,
  selectedSquare,
  setCapturedPieces,
  setCircuits,
  setDidAction,
  setFlow,
  setPieces,
  setSelectedSquare,
  validMoves,
} from "~/signals";
import {
  initStateOf,
  measure,
  newCircuit,
  prob0,
  removePiece,
  squareToPos,
  updatePiece,
} from "~/utils";
import PieceImg from "./PieceImg";
import PromotionPicker from "./PromotionPicker";
import ContextMenu from "./ContextMenu";

export default function Square(props: { i: number }) {
  const [showContextMenu, setShowContextMenu] = createSignal<{
    left: number;
    top: number;
  }>();
  const [bubble, setBubble] = createSignal<string>();
  const [shake, setShake] = createSignal(false);
  const { row, column } = squareToPos(props.i);
  const [promotion, setPromotion] = createSignal<Piece>();
  const shaded = Math.abs(row - column) % 2 == 1;
  const piece = () =>
    pieces().find((p) => p.position.row == row && p.position.column == column);

  const isValidMove = () => {
    const p = selectedPiece();
    if (!p) return false;
    if (p.color == "black" && flow() !== "turn-black") return;
    if (p.color == "white" && flow() !== "turn-white") return;
    return validMoves().some((m) => m.column == column && m.row == row);
  };
  const clickable = () => (piece() ? true : false) || isValidMove();

  return (
    <div
      onClick={() => {
        const thisP = piece();
        const selectedP = selectedPiece();

        if (isValidMove()) {
          console.log("isValidMove");
          if (!selectedP) return;
          const updatedP: Piece = {
            ...selectedP,
            position: {
              column,
              row,
            },
          };

          const capturedPiece = pieces().find(
            (piece) =>
              piece.position.row === row && piece.position.column === column
          );

          batch(() => {
            if (capturedPiece) {
              setCapturedPieces([...capturedPieces(), capturedPiece]);
              removePiece(capturedPiece.id);
            }

            updatePiece(updatedP);
          });

          if (updatedP.name == "pawn") {
            if (updatedP.color == "black") {
              if (row == 7) {
                setPromotion(updatedP);
              }
            }
            if (updatedP.color == "white") {
              if (row == 0) {
                setPromotion(updatedP);
              }
            }
          }

          setSelectedSquare();
          if (capturedPiece?.name == "king") {
            setFlow(
              capturedPiece.color == "black"
                ? "ended-white-win"
                : "ended-black-win"
            );
          } else {
            setFlow(flow() == "turn-black" ? "turn-white" : "turn-black");
          }

          return;
        }

        if (thisP) {
          console.log("p", thisP, flow());
          if (thisP.color == "black" && flow() !== "turn-black") return;
          if (thisP.color == "white" && flow() !== "turn-white") return;
        }

        console.log("set to", props.i, thisP, flow());
        setSelectedSquare(props.i);
      }}
      class=" bg-[#eeeed2] 
      data-[shaded=true]:bg-[#769656] 
      flex items-center justify-center 
      data-[clickable=true]:cursor-pointer 
      data-[selected=true]:!bg-blue-500 
      group
      relative "
      data-shaded={shaded}
      data-clickable={clickable()}
      data-selected={selectedSquare() == props.i}
    >
      <Show when={showContextMenu()}>
        <ContextMenu
          onItemClick={async (gate) => {
            setShowContextMenu();
            setDidAction(true);

            const p = piece();
            if (!p) return;

            if (gate == "measure") {
              // Send to backend to execute circuit
              const data = await measure(p.circuit);
              console.log("measurement data", data);

              // Set each pieces'state accordingly
              data.qubits.forEach((q, i) => {
                const piece = pieces().find((p) => p.id == q.id);
                if (!piece) {
                  console.warn("cannot happen");
                  return;
                }

                const color: Color =
                  Number(data.measurement[i]) == 0 ? "black" : "white";

                const updatedP: Piece = {
                  ...piece,
                  color,
                  circuit: newCircuit(),
                };

                updatePiece(updatedP);
                setShake(true);
                setTimeout(() => {
                  setShake(false);
                  setBubble(
                    updatedP.color == p.color
                      ? "I remain loyal!"
                      : "Haha, I’ve switched sides!"
                  );

                  updatedP.prob_black = updatedP.color == "black" ? 1 : 0;
                  updatePiece(updatedP);
                  setTimeout(() => {
                    setBubble();
                  }, 2000);
                }, 600);
              });

              return;
            }

            if (gate == "cx") {
              // Select the other piece
              // New circuit and set for both piece?
              // Or spanning tree much
              // check if they are entangled after
              // I'm too lazy to check if they are entangled or not, maybe we can just all measure them?
              return;
            }

            p.circuit.actions.push({
              gate,
              args: [p.id],
            });
            const data = await measure(p.circuit);
            p.circuit.latex = data.latex;
            setCircuits((cs) => [...cs]);

            // Set each pieces'state accordingly
            data.qubits.forEach((q, i) => {
              const piece = pieces().find((p) => p.id == q.id);
              if (!piece) {
                console.warn("cannot happen");
                return;
              }

              const probs_where_0_at_i = Object.keys(data.probabilities)
                .filter((state) => state[i] == "0")
                .map((s) => data.probabilities[s]);
              const prob_black = probs_where_0_at_i.reduce(
                (acc, prob) => acc + prob,
                0
              );

              const updatedP: Piece = {
                ...piece,
                prob_black,
              };

              updatePiece(updatedP);
            });
          }}
          showContextMenu={showContextMenu}
          setShowContextMenu={setShowContextMenu}
        />
      </Show>

      <Show when={isValidMove()}>
        <Show
          when={piece()}
          fallback={
            // Move
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-600/30 w-6 h-6 rounded-full"></div>
          }
        >
          {/* Capture */}
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-neutral-600/30 w-20 h-20 rounded-full"></div>
        </Show>
      </Show>

      <Show when={promotion()}>
        {(pro) => (
          <PromotionPicker
            promotion={pro()}
            onDone={(name) => {
              const updatedP: Piece = {
                ...pro(),
                name,
              };

              updatePiece(updatedP);
              setPromotion();
            }}
          />
        )}
      </Show>
      <PieceImg piece={piece()} shake={shake()} />

      <Show when={piece()}>
        {(p) => (
          <Show when={p().name !== "king"}>
            <>
              <div
                onClick={(e) => {
                  setSelectedSquare(props.i);
                  setShowContextMenu({
                    left: e.clientX,
                    top: e.clientY,
                  });
                }}
                class="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-neutral-200 invisible group-hover:visible"
              >
                <svg
                  fill="currentColor"
                  stroke-width="0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  style="overflow: visible; color: currentcolor;"
                >
                  <path d="M3.102 20.898c.698.699 1.696 1.068 2.887 1.068 1.742 0 3.855-.778 6.012-2.127 2.156 1.35 4.27 2.127 6.012 2.127 1.19 0 2.188-.369 2.887-1.068 1.269-1.269 1.411-3.413.401-6.039-.358-.932-.854-1.895-1.457-2.859a16.792 16.792 0 0 0 1.457-2.859c1.01-2.626.867-4.771-.401-6.039-.698-.699-1.696-1.068-2.887-1.068-1.742 0-3.855.778-6.012 2.127-2.156-1.35-4.27-2.127-6.012-2.127-1.19 0-2.188.369-2.887 1.068C1.833 4.371 1.69 6.515 2.7 9.141c.359.932.854 1.895 1.457 2.859A16.792 16.792 0 0 0 2.7 14.859c-1.01 2.626-.867 4.77.402 6.039zm16.331-5.321c.689 1.79.708 3.251.052 3.907-.32.32-.815.482-1.473.482-1.167 0-2.646-.503-4.208-1.38a26.611 26.611 0 0 0 4.783-4.784c.336.601.623 1.196.846 1.775zM12 17.417a23.568 23.568 0 0 1-2.934-2.483A23.998 23.998 0 0 1 6.566 12 23.74 23.74 0 0 1 12 6.583a23.568 23.568 0 0 1 2.934 2.483 23.998 23.998 0 0 1 2.5 2.934A23.74 23.74 0 0 1 12 17.417zm6.012-13.383c.657 0 1.152.162 1.473.482.656.656.638 2.117-.052 3.907-.223.579-.51 1.174-.846 1.775a26.448 26.448 0 0 0-4.783-4.784c1.562-.876 3.041-1.38 4.208-1.38zM4.567 8.423c-.689-1.79-.708-3.251-.052-3.907.32-.32.815-.482 1.473-.482 1.167 0 2.646.503 4.208 1.38a26.448 26.448 0 0 0-4.783 4.784 13.934 13.934 0 0 1-.846-1.775zm0 7.154c.223-.579.51-1.174.846-1.775a26.448 26.448 0 0 0 4.783 4.784c-1.563.877-3.041 1.38-4.208 1.38-.657 0-1.152-.162-1.473-.482-.656-.656-.637-2.117.052-3.907z"></path>
                  <path d="M12 9.426A2.574 2.574 0 1 0 12 14.574 2.574 2.574 0 1 0 12 9.426z"></path>
                </svg>
              </div>

              <div
                data-white={p().color == "white"}
                class="absolute bg-white w-2/3 bottom-1 h-3 border data-[white=true]:border-neutral-800 drop-shadow"
              >
                <div
                  class="bg-black h-full transition-all duration-500"
                  style={{
                    width: `${p().prob_black * 100}%`,
                  }}
                ></div>
              </div>
            </>
          </Show>
        )}
      </Show>

      <Show when={bubble()}>
        {(b) => (
          <div class="px-2 py-1 border bg-white absolute right-0 -top-10  translate-x-1/2 z-20 drop-shadow relative-with-triangle">
            {b()}
          </div>
        )}
      </Show>
    </div>
  );
}
