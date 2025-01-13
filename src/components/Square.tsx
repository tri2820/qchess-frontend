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
import { measure, prob0, removePiece, squareToPos, updatePiece } from "~/utils";
import PieceImg from "./PieceImg";
import PromotionPicker from "./PromotionPicker";
import ContextMenu from "./ContextMenu";

export default function Square(props: { i: number }) {
  const [showContextMenu, setShowContextMenu] = createSignal<{
    left: number;
    top: number;
  }>();
  const { row, column } = squareToPos(props.i);
  const [promotion, setPromotion] = createSignal<Piece>();
  const shaded = Math.abs(row - column) % 2 == 1;
  const piece = () =>
    pieces().find((p) => p.position.row == row && p.position.column == column);

  const isValidMove = () =>
    validMoves().some((m) => m.column == column && m.row == row);
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
        if (piece()) {
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
              const measurement = await measure(p.circuit);
              console.log("measurement", measurement);
              // Send to backend to execute circuit
              return;
            }

            if (gate == "cx") {
              // Select the other piece
              // New circuit and set for both piece?
              // Or spanning tree much
              // check if they are entangled after
              return;
            }

            p.circuit.actions.push({
              gate,
              args: [p.id],
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
      <PieceImg piece={piece()} />

      <Show when={piece()}>
        {(p) => (
          <div class="absolute bg-white w-2/3 bottom-1 h-3 border drop-shadow">
            <div
              class="bg-black h-full"
              style={{
                width: `${prob0(p().state) * 100}%`,
              }}
            ></div>
          </div>
        )}
      </Show>
    </div>
  );
}
