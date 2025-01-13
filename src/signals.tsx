import { createSignal } from "solid-js";
export type Piece = {
  color: "white" | "black";
  name: "rook" | "knight" | "queen" | "bishop" | "pawn" | "king";
  state: {
    alpha_0: [number, number];
    beta_1: [number, number];
  };
  position: {
    row: number;
    column: number;
  };
};

export const [pieces, setPieces] = createSignal<Piece[]>([
  {
    color: "black",
    name: "rook",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 0, row: 0 },
  },
  {
    color: "black",
    name: "knight",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 1, row: 0 },
  },
  {
    color: "black",
    name: "bishop",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 2, row: 0 },
  },
  {
    color: "black",
    name: "queen",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 3, row: 0 },
  },
  {
    color: "black",
    name: "king",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 4, row: 0 },
  },
  {
    color: "black",
    name: "bishop",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 5, row: 0 },
  },
  {
    color: "black",
    name: "knight",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 6, row: 0 },
  },
  {
    color: "black",
    name: "rook",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 7, row: 0 },
  },
  {
    color: "black",
    name: "pawn",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 0, row: 1 },
  },
  {
    color: "black",
    name: "pawn",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 1, row: 1 },
  },
  {
    color: "black",
    name: "pawn",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 2, row: 1 },
  },
  {
    color: "black",
    name: "pawn",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 3, row: 1 },
  },
  {
    color: "black",
    name: "pawn",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 4, row: 1 },
  },
  {
    color: "black",
    name: "pawn",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 5, row: 1 },
  },
  {
    color: "black",
    name: "pawn",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 6, row: 1 },
  },
  {
    color: "black",
    name: "pawn",
    state: { alpha_0: [0, 0], beta_1: [1, 1] },
    position: { column: 7, row: 1 },
  },
  {
    color: "white",
    name: "rook",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 0, row: 7 },
  },
  {
    color: "white",
    name: "knight",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 1, row: 7 },
  },
  {
    color: "white",
    name: "bishop",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 2, row: 7 },
  },
  {
    color: "white",
    name: "queen",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 3, row: 7 },
  },
  {
    color: "white",
    name: "king",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 4, row: 7 },
  },
  {
    color: "white",
    name: "bishop",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 5, row: 7 },
  },
  {
    color: "white",
    name: "knight",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 6, row: 7 },
  },
  {
    color: "white",
    name: "rook",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 7, row: 7 },
  },
  {
    color: "white",
    name: "pawn",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 0, row: 6 },
  },
  {
    color: "white",
    name: "pawn",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 1, row: 6 },
  },
  {
    color: "white",
    name: "pawn",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 2, row: 6 },
  },
  {
    color: "white",
    name: "pawn",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 3, row: 6 },
  },
  {
    color: "white",
    name: "pawn",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 4, row: 6 },
  },
  {
    color: "white",
    name: "pawn",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 5, row: 6 },
  },
  {
    color: "white",
    name: "pawn",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 6, row: 6 },
  },
  {
    color: "white",
    name: "pawn",
    state: { alpha_0: [1, 1], beta_1: [0, 0] },
    position: { column: 7, row: 6 },
  },
]);
