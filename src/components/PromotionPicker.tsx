import { Name, Piece } from "~/types";
import PieceImg from "./PieceImg";

type PickerProps = {
  promotion: Piece;
  onDone: (name: Name) => void;
};

function PickerItem(props: { name: Name } & PickerProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        props.onDone(props.name);
      }}
    >
      <button>
        <PieceImg
          size="sm"
          piece={{
            name: props.name,
            color: props.promotion.color,
          }}
        />
      </button>
    </div>
  );
}

export default function PromotionPicker(props: PickerProps) {
  return (
    <div class="absolute -top-2 right-0 bg-white translate-x-full z-30 drop-shadow">
      <PickerItem name="queen" {...props} />
      <PickerItem name="rook" {...props} />
      <PickerItem name="knight" {...props} />
      <PickerItem name="bishop" {...props} />
    </div>
  );
}
