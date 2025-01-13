import { pieces } from "~/signals";

export default function Square(props: { i: number }) {
  const row = Math.floor(props.i / 8);
  const column = props.i % 8;
  const piece = () =>
    pieces().find((p) => p.position.row == row && p.position.column);

  return (
    <div class="border">
      {piece()?.name} - {piece()?.color}
      {/* row {row} column {column} */}
    </div>
  );
}
