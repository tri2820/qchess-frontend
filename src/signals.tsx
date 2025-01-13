import { createSignal } from "solid-js";
import { initStateOf, listValidMoves, newCircuit, squareToPos } from "./utils";
export type Gate = "h" | "cx" | "x" | "y" | "z" | "measure";
export type Color = "white" | "black";
export type Name = "rook" | "knight" | "queen" | "bishop" | "pawn" | "king";
export type ValidMove = {
  row: number;
  column: number;
};
export type State = {
  alpha: [number, number];
  beta: [number, number];
};

export type PieceId = string;
export type Piece = {
  id: PieceId;
  color: Color;
  name: Name;
  circuit: Circuit;
  position: {
    row: number;
    column: number;
  };

  // For UI only
  state: State;
};

export type Action = {
  gate: Gate;
  args: PieceId[];
};
export type Circuit = {
  id: string;
  actions: Action[];
};

export const [circuits, setCircuits] = createSignal<Circuit[]>([]);

// At first, each piece has its own circuit
export const [pieces, setPieces] = createSignal<Piece[]>([
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "rook",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 0, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "knight",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 1, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "bishop",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 2, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "queen",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 3, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "king",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 4, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "bishop",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 5, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "knight",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 6, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "rook",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 7, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 0, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 1, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 2, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 3, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 4, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 5, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 6, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("black"),
    position: { column: 7, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "rook",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 0, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "knight",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 1, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "bishop",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 2, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "queen",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 3, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "king",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 4, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "bishop",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 5, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "knight",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 6, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "rook",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 7, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 0, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 1, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 2, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 3, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 4, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 5, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 6, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    name: "pawn",
    circuit: newCircuit(),
    state: initStateOf("white"),
    position: { column: 7, row: 6 },
  },
]);

export const [selectedSquare, setSelectedSquare] = createSignal<number>();
export const selectedPiece = () => {
  const i = selectedSquare();
  if (i === undefined) return;
  const { row, column } = squareToPos(i);
  return pieces().find(
    (p) => p.position.row == row && p.position.column == column
  );
};
export const validMoves = () => {
  const p = selectedPiece();
  if (p === undefined) return [];
  return listValidMoves(p, pieces());
};

export const [capturedPieces, setCapturedPieces] = createSignal<Piece[]>([]);
export type Flow =
  | "turn-white"
  | "turn-black"
  // white-promotion
  // black-promotion
  | "ended-white-win"
  | "ended-black-win";

export const [didAction, setDidAction] = createSignal(false);
export const [flow, setFlow] = createSignal<Flow>("turn-white");
export const systemState = () => {
  return {
    gates: [],
    states: pieces()
      .filter((p) => !["king", "pawn"].includes(p.name))
      .map((p) => {
        return {
          id: p.id,
          state: p.state,
        };
      }),
  };
};
