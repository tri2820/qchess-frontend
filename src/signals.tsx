import { createSignal } from "solid-js";
import {
  findEntangledMesh,
  initStateOf,
  listValidMoves,
  newCircuit,
  squareToPos,
} from "./utils";
import { Flow, Piece } from "./types";
// At first, each piece has its own circuit
export const [pieces, setPieces] = createSignal<Piece[]>([
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "rook",
    circuit: newCircuit(),

    position: { column: 0, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "knight",
    circuit: newCircuit(),

    position: { column: 1, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "bishop",
    circuit: newCircuit(),

    position: { column: 2, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "queen",
    circuit: newCircuit(),

    position: { column: 3, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "king",
    circuit: newCircuit(),

    position: { column: 4, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "bishop",
    circuit: newCircuit(),

    position: { column: 5, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "knight",
    circuit: newCircuit(),

    position: { column: 6, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "rook",
    circuit: newCircuit(),

    position: { column: 7, row: 0 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 0, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 1, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 2, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 3, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 4, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 5, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 6, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "black",
    prob_black: 1,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 7, row: 1 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "rook",
    circuit: newCircuit(),

    position: { column: 0, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "knight",
    circuit: newCircuit(),

    position: { column: 1, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "bishop",
    circuit: newCircuit(),

    position: { column: 2, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "queen",
    circuit: newCircuit(),

    position: { column: 3, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "king",
    circuit: newCircuit(),

    position: { column: 4, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "bishop",
    circuit: newCircuit(),

    position: { column: 5, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "knight",
    circuit: newCircuit(),

    position: { column: 6, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "rook",
    circuit: newCircuit(),

    position: { column: 7, row: 7 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 0, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 1, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 2, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 3, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 4, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 5, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 6, row: 6 },
  },
  {
    id: crypto.randomUUID(),
    color: "white",
    prob_black: 0,
    name: "pawn",
    circuit: newCircuit(),

    position: { column: 7, row: 6 },
  },
]);

export const [selectedSquare, setSelectedSquare] = createSignal<number>();
export const selectedCircuitLatex = () => selectedPiece()?.circuit.latex;
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

export const capturedPieces = () => pieces().filter((p) => p.captured);

export const [didAction, setDidAction] = createSignal(false);
export const [flow, setFlow] = createSignal<Flow>("turn-white");
export const [pickAnother, setPickAnother] = createSignal<{
  first: number;
  resolve: (p: Piece) => void;
}>();

export const mesh = () => {
  const p = selectedPiece();
  if (!p) return [];
  return findEntangledMesh(p.circuit, p.id);
};

export const entanglements = () => {
  const p = selectedPiece();
  if (!p) return [];
  return p.circuit.entanglements;
};

export const [bubbles, setBubbles] = createSignal<
  { id: string; words: string }[]
>([]);
export const [shakes, setShakes] = createSignal<string[]>([]);
