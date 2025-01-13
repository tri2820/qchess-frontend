import { createSignal, onMount, Show, untrack } from "solid-js";
import {
  capturedPieces,
  Piece,
  pieces,
  selectedPiece,
  selectedSquare,
  setCapturedPieces,
  setPieces,
  setSelectedSquare,
  validMoves,
} from "~/signals";
import { squareToPos } from "~/utils";

export default function Square(props: { i: number }) {
  const { row, column } = squareToPos(props.i);
  const shaded = Math.abs(row - column) % 2 == 1;
  const piece = () =>
    pieces().find((p) => p.position.row == row && p.position.column == column);

  const imgSrc = () => {
    const p = piece();
    if (!p) return;
    return `/pieces/${p.name}-${p.color == "black" ? "b" : "w"}.svg`;
  };

  const isValidMove = () =>
    validMoves().some((m) => m.column == column && m.row == row);

  return (
    <div
      onClick={() => {
        if (isValidMove()) {
          const p = selectedPiece();
          if (!p) return;
          const updatedP: Piece = {
            ...p,
            position: {
              column,
              row,
            },
          };

          const capturedPiece = pieces().find(
            (piece) =>
              piece.position.row === row && piece.position.column === column
          );

          if (capturedPiece) {
            setCapturedPieces([...capturedPieces(), capturedPiece]);
          }

          setPieces(
            pieces()
              .filter((piece) => piece.id !== capturedPiece?.id)
              .map((piece) => (piece.id === p.id ? updatedP : piece))
          );
          return;
        }
        setSelectedSquare(props.i);
      }}
      class=" bg-[#eeeed2] data-[shaded=true]:bg-[#769656] flex items-center justify-center data-[clickable=true]:cursor-pointer data-[selected=true]:bg-blue-500 data-[valid=true]:bg-red-500"
      data-shaded={shaded}
      data-clickable={piece() ? true : false}
      data-selected={selectedSquare() == props.i}
      data-valid={isValidMove()}
    >
      {/* <div class="line-clamp-1">{piece()?.id}</div> */}
      <div class="w-20 h-20 p-1">
        <Show when={imgSrc()}>
          {(src) => <img src={src()} class="w-full h-full" />}
        </Show>
      </div>
    </div>
  );
}
