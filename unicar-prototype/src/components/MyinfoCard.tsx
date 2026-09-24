import { Button } from "antd";
import { SingpassRetrieveButtonArt } from "../assets";
import { copy } from "../data/mock";

type Props =
  | { variant: "retrieve"; onRetrieve: () => void }
  | { variant: "clear"; onClear: () => void };

// "Speed up form filling with Myinfo" card. Frames 8383:5191 / 8517:3153 use the Singpass
// retrieve button; the 3-vehicle frames (8543:*) swap it for "Clear Form" with different copy.
export default function MyinfoCard(props: Props) {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center gap-3 justify-between">
      <div className="flex flex-col gap-1 leading-[1.5]">
        <p className="text-[18px] font-semibold text-text-primary">{copy.myinfoTitle}</p>
        <p className="text-[14px] text-text-secondary">
          {props.variant === "retrieve" ? copy.myinfoRetrieveDesc : copy.myinfoClearDesc}
        </p>
      </div>
      {props.variant === "retrieve" ? (
        <button
          aria-label="Retrieve with Singpass"
          onClick={props.onRetrieve}
          className="shrink-0 p-0 border-0 bg-transparent cursor-pointer"
        >
          <SingpassRetrieveButtonArt />
        </button>
      ) : (
        <Button
          onClick={props.onClear}
          className="shrink-0 !h-auto !px-8 !py-[14px] !text-[16px] !font-medium !text-text-secondary"
        >
          Clear Form
        </Button>
      )}
    </div>
  );
}
