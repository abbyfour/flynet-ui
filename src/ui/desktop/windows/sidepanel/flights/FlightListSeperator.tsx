import "./FlightSeparator.scss";

type FlightListSeparatorProps = {
  label: string | number;
};

export function FlightListSeparator({ label }: FlightListSeparatorProps) {
  return (
    <div className="FlightListSeparator">
      <span className="label">{label}</span>
    </div>
  );
}
