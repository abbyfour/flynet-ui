import "./FlightSeparator.scss";

type FlightSeparatorProps = {
  label: string | number;
};

export function FlightSeparator({ label }: FlightSeparatorProps) {
  return (
    <div className="FlightSeparator">
      <span className="label">{label}</span>
    </div>
  );
}
