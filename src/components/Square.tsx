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
      relative "
      data-shaded={shaded}
      data-clickable={clickable()}
      data-selected={selectedSquare() == props.i}
      onContextMenu={(e) => {
        const p = piece();
        if (p) {
          if (p.name == "king") return;
          e.preventDefault();
          e.stopPropagation();
          setSelectedSquare(props.i);
          setShowContextMenu({
            left: e.clientX,
            top: e.clientY,
          });
        }
      }}
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
