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
  captured?: boolean;

  // For UI only
  prob_black: number;
};

export type Action = {
  created_at: string;
  gate: Gate;
  args: PieceId[];
};
export type Entanglement = {
  idA: PieceId;
  idB: PieceId;
};
export type Circuit = {
  id: string;
  actions: Action[];
  latex?: string;
  entanglements: Entanglement[];
};
export type Flow =
  | "turn-white"
  | "turn-black"
  // white-promotion
  // black-promotion
  | "ended-white-win"
  | "ended-black-win";

export type MeasurementData = {
  entanglement: boolean;
  latex: string;
  measurement: string;
  probabilities: {
    [state: string]: number;
  };
  qubits: { id: string }[];
};

export type Qubit = {
  id: string;
  classicalState: 0 | 1;
};
