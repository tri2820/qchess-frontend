import { pieces, setPieces } from "./signals";
import {
  Circuit,
  Color,
  MeasurementData,
  Piece,
  Qubit,
  State,
  ValidMove,
} from "./types";

const backend_url = import.meta.env.DEV
  ? import.meta.env.VITE_BACKEND_URL_DEV
  : import.meta.env.VITE_BACKEND_URL_PROD;

export function squareToPos(i: number) {
  const row = Math.floor(i / 8);
  const column = i % 8;
  return { row, column };
}

export function posToSquare(row: number, column: number): number {
  return row * 8 + column;
}

// Helper function to check if a move is within the bounds of the board
export const isInBound = (row: number, column: number) => {
  return row >= 0 && row <= 7 && column >= 0 && column <= 7;
};
export function listValidMoves(p: Piece, pieces: Piece[]) {
  const moves: ValidMove[] = [];

  // Helper function to check if a square is occupied by a piece (of any color)
  const isOccupied = (row: number, column: number) => {
    const pieceAtSquare = pieces.find(
      (piece) => piece.position.row === row && piece.position.column === column
    );
    return pieceAtSquare !== undefined;
  };

  // Helper function to check if the path is clear (not hit another piece of any color)
  const isPathClear = (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ): boolean => {
    const rowStep = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
    const colStep = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;

    let row = startRow + rowStep;
    let col = startCol + colStep;

    while (row !== endRow || col !== endCol) {
      if (isOccupied(row, col)) {
        return false; // Path is blocked
      }
      row += rowStep;
      col += colStep;
    }
    return true; // Path is clear
  };

  // Helper function to check if a target square is occupied by a piece of the same color
  const isSameColorPiece = (row: number, column: number): boolean => {
    const pieceAtSquare = pieces.find(
      (piece) => piece.position.row === row && piece.position.column === column
    );
    return pieceAtSquare?.color === p.color;
  };

  // Bishop moves: Diagonal moves in all four directions (path must be clear)
  if (p.name == "bishop") {
    for (let i = 1; i <= 7; i++) {
      if (
        isInBound(p.position.row + i, p.position.column + i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row + i,
          p.position.column + i
        ) &&
        !isSameColorPiece(p.position.row + i, p.position.column + i)
      )
        moves.push({ row: p.position.row + i, column: p.position.column + i });
      if (
        isInBound(p.position.row + i, p.position.column - i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row + i,
          p.position.column - i
        ) &&
        !isSameColorPiece(p.position.row + i, p.position.column - i)
      )
        moves.push({ row: p.position.row + i, column: p.position.column - i });
      if (
        isInBound(p.position.row - i, p.position.column + i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row - i,
          p.position.column + i
        ) &&
        !isSameColorPiece(p.position.row - i, p.position.column + i)
      )
        moves.push({ row: p.position.row - i, column: p.position.column + i });
      if (
        isInBound(p.position.row - i, p.position.column - i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row - i,
          p.position.column - i
        ) &&
        !isSameColorPiece(p.position.row - i, p.position.column - i)
      )
        moves.push({ row: p.position.row - i, column: p.position.column - i });
    }
  }

  // Rook moves: Vertical and horizontal moves (path must be clear)
  if (p.name == "rook") {
    for (let i = 1; i <= 7; i++) {
      if (
        isInBound(p.position.row + i, p.position.column) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row + i,
          p.position.column
        ) &&
        !isSameColorPiece(p.position.row + i, p.position.column)
      )
        moves.push({ row: p.position.row + i, column: p.position.column });
      if (
        isInBound(p.position.row - i, p.position.column) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row - i,
          p.position.column
        ) &&
        !isSameColorPiece(p.position.row - i, p.position.column)
      )
        moves.push({ row: p.position.row - i, column: p.position.column });
      if (
        isInBound(p.position.row, p.position.column + i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row,
          p.position.column + i
        ) &&
        !isSameColorPiece(p.position.row, p.position.column + i)
      )
        moves.push({ row: p.position.row, column: p.position.column + i });
      if (
        isInBound(p.position.row, p.position.column - i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row,
          p.position.column - i
        ) &&
        !isSameColorPiece(p.position.row, p.position.column - i)
      )
        moves.push({ row: p.position.row, column: p.position.column - i });
    }
  }

  // Queen moves: Combination of rook and bishop moves (path must be clear)
  if (p.name == "queen") {
    // Rook-like moves
    for (let i = 1; i <= 7; i++) {
      if (
        isInBound(p.position.row + i, p.position.column) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row + i,
          p.position.column
        ) &&
        !isSameColorPiece(p.position.row + i, p.position.column)
      )
        moves.push({ row: p.position.row + i, column: p.position.column });
      if (
        isInBound(p.position.row - i, p.position.column) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row - i,
          p.position.column
        ) &&
        !isSameColorPiece(p.position.row - i, p.position.column)
      )
        moves.push({ row: p.position.row - i, column: p.position.column });
      if (
        isInBound(p.position.row, p.position.column + i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row,
          p.position.column + i
        ) &&
        !isSameColorPiece(p.position.row, p.position.column + i)
      )
        moves.push({ row: p.position.row, column: p.position.column + i });
      if (
        isInBound(p.position.row, p.position.column - i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row,
          p.position.column - i
        ) &&
        !isSameColorPiece(p.position.row, p.position.column - i)
      )
        moves.push({ row: p.position.row, column: p.position.column - i });
    }
    // Bishop-like moves
    for (let i = 1; i <= 7; i++) {
      if (
        isInBound(p.position.row + i, p.position.column + i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row + i,
          p.position.column + i
        ) &&
        !isSameColorPiece(p.position.row + i, p.position.column + i)
      )
        moves.push({ row: p.position.row + i, column: p.position.column + i });
      if (
        isInBound(p.position.row + i, p.position.column - i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row + i,
          p.position.column - i
        ) &&
        !isSameColorPiece(p.position.row + i, p.position.column - i)
      )
        moves.push({ row: p.position.row + i, column: p.position.column - i });
      if (
        isInBound(p.position.row - i, p.position.column + i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row - i,
          p.position.column + i
        ) &&
        !isSameColorPiece(p.position.row - i, p.position.column + i)
      )
        moves.push({ row: p.position.row - i, column: p.position.column + i });
      if (
        isInBound(p.position.row - i, p.position.column - i) &&
        isPathClear(
          p.position.row,
          p.position.column,
          p.position.row - i,
          p.position.column - i
        ) &&
        !isSameColorPiece(p.position.row - i, p.position.column - i)
      )
        moves.push({ row: p.position.row - i, column: p.position.column - i });
    }
  }

  // King moves: One square in any direction (filter out moves that hit pieces of the same color)
  if (p.name == "king") {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i !== 0 || j !== 0) {
          if (
            isInBound(p.position.row + i, p.position.column + j) &&
            !isSameColorPiece(p.position.row + i, p.position.column + j)
          ) {
            moves.push({
              row: p.position.row + i,
              column: p.position.column + j,
            });
          }
        }
      }
    }
  }

  // Knight moves: "L" shape (2 squares in one direction and 1 in the perpendicular direction)
  if (p.name == "knight") {
    const knightMoves = [
      { row: 2, column: 1 },
      { row: 2, column: -1 },
      { row: -2, column: 1 },
      { row: -2, column: -1 },
      { row: 1, column: 2 },
      { row: 1, column: -2 },
      { row: -1, column: 2 },
      { row: -1, column: -2 },
    ];
    for (const move of knightMoves) {
      const newRow = p.position.row + move.row;
      const newColumn = p.position.column + move.column;
      if (
        isInBound(newRow, newColumn) &&
        !isSameColorPiece(newRow, newColumn)
      ) {
        moves.push({ row: newRow, column: newColumn });
      }
    }
  }

  // Pawn moves: Forward one square, two squares on the first move, captures diagonally (only if piece of opposite color)
  if (p.name == "pawn") {
    const direction = p.color === "white" ? -1 : 1;
    // Move one square forward (must not be occupied)
    if (
      isInBound(p.position.row + direction, p.position.column) &&
      !isOccupied(p.position.row + direction, p.position.column)
    ) {
      moves.push({
        row: p.position.row + direction,
        column: p.position.column,
      });
    }
    // Move two squares forward (only if on starting row and the destination is not occupied)
    if (
      (p.color === "white" && p.position.row === 6) ||
      (p.color === "black" && p.position.row === 1)
    ) {
      if (
        isInBound(p.position.row + 2 * direction, p.position.column) &&
        !isOccupied(p.position.row + 2 * direction, p.position.column)
      ) {
        moves.push({
          row: p.position.row + 2 * direction,
          column: p.position.column,
        });
      }
    }
    // Capture diagonally (only if there's an opponent's piece)
    if (isInBound(p.position.row + direction, p.position.column + 1)) {
      const pieceAtRight = pieces.find(
        (piece) =>
          piece.position.row === p.position.row + direction &&
          piece.position.column === p.position.column + 1
      );
      if (pieceAtRight && pieceAtRight.color !== p.color) {
        moves.push({
          row: p.position.row + direction,
          column: p.position.column + 1,
        });
      }
    }
    if (isInBound(p.position.row + direction, p.position.column - 1)) {
      const pieceAtLeft = pieces.find(
        (piece) =>
          piece.position.row === p.position.row + direction &&
          piece.position.column === p.position.column - 1
      );
      if (pieceAtLeft && pieceAtLeft.color !== p.color) {
        moves.push({
          row: p.position.row + direction,
          column: p.position.column - 1,
        });
      }
    }
  }

  return moves;
}

export function updatePiece(updatedP: Piece) {
  setPieces((pieces) =>
    pieces.map((piece) => (piece.id === updatedP.id ? updatedP : piece))
  );
}
export function removePiece(id: string) {
  setPieces((pieces) => pieces.filter((piece) => piece.id !== id));
}

export function initStateOf(color: Color): State {
  return color == "black"
    ? { alpha: [1, 0], beta: [0, 0] }
    : { alpha: [0, 0], beta: [1, 0] };
}

export const newCircuit = (): Circuit => {
  return {
    entanglements: [],
    id: crypto.randomUUID(),
    actions: [],
  };
};

// Function to calculate the probability of measuring |0⟩
export const prob0 = (s: State): number => {
  const [realAlpha, imagAlpha] = s.alpha;
  // Calculate the squared magnitude of alpha (|alpha|^2)
  return realAlpha * realAlpha + imagAlpha * imagAlpha;
};

export function involvedQubits(circuit: Circuit): Qubit[] {
  const involvedPiecesId = circuit.actions.flatMap((a) => a.args);
  const qubits: Qubit[] = pieces()
    .filter((p0) => involvedPiecesId.includes(p0.id))
    .map((p) => {
      return {
        id: p.id,
        classicalState: p.color == "black" ? 0 : 1,
      };
    });

  return qubits;
}

export function findEntangledMesh(circuit: Circuit, id: string) {
  const entangledQubits: string[] = [id];

  while (true) {
    let newEntangledQubits: string[] = [];
    circuit.entanglements.forEach((e) => {
      if (entangledQubits.includes(e.idA)) {
        if (!entangledQubits.includes(e.idB)) {
          newEntangledQubits.push(e.idB);
        }
      }

      if (entangledQubits.includes(e.idB)) {
        if (!entangledQubits.includes(e.idA)) {
          newEntangledQubits.push(e.idA);
        }
      }
    });

    if (newEntangledQubits.length == 0) break;
    entangledQubits.push(...newEntangledQubits);
  }
  return entangledQubits;
}
export async function measure(circuit: Circuit): Promise<MeasurementData> {
  const qubits = involvedQubits(circuit);
  const payload = {
    actions: circuit.actions,
    qubits,
  };
  console.log("send", payload);
  const api_route = `${backend_url}/measure`;
  const response = await fetch(api_route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });
  const data = await response.json();
  console.log("data", data);
  return data;
}
