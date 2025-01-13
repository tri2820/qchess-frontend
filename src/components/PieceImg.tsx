import { Show } from "solid-js";
import { Color, Name } from "~/signals";

export default function PieceImg(props: {
  piece?: {
    name: Name;
    color: Color;
  };
  shake?: boolean;
  size?: "sm" | "md";
}) {
  const imgSrc = () => {
    const p = props.piece;
    if (!p) return;
    return `/pieces/${p.name}-${p.color == "black" ? "b" : "w"}.svg`;
  };

  return (
    <div
      class={
        "w-20 h-20 p-1 data-[sm=true]:w-14 data-[sm=true]:h-14 " +
        (props.shake ? "shake" : "")
      }
      data-sm={props.size == "sm"}
    >
      <Show when={imgSrc()}>
        {(src) => <img src={src()} class="w-full h-full" />}
      </Show>
    </div>
  );
}
