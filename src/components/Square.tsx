import { batch, createSignal, onMount, Show, untrack } from "solid-js";
import {
  capturedPieces,
  Color,
  Piece,
  pieces,
  selectedPiece,
  selectedSquare,
  setCapturedPieces,
  setPieces,
  setSelectedSquare,
  validMoves,
} from "~/signals";
import { removePiece, squareToPos, updatePiece } from "~/utils";
import PieceImg from "./PieceImg";
import PromotionPicker from "./PromotionPicker";

export default function Square(props: { i: number }) {
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
        if (isValidMove()) {
          const p = untrack(selectedPiece);
          const ps = untrack(pieces);
          const cp = untrack(capturedPieces);
          if (!p) return;
          const updatedP: Piece = {
            ...p,
            position: {
              column,
              row,
            },
          };

          const capturedPiece = ps.find(
            (piece) =>
              piece.position.row === row && piece.position.column === column
          );

          batch(() => {
            if (capturedPiece) {
              setCapturedPieces([...cp, capturedPiece]);
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
          return;
        }

        console.log("set to props.", props.i);
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
    >
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
    </div>
  );
}
