import { useEffect, useState } from "react";
import { Airport } from "../../data/classes/flights/Airport";
import type { AirportProperties } from "../../data/classes/flights/NewFlightProperties";
import { useLazyGetAirportByCodeQuery } from "../../data/services/flights/flightsAPI";
import { Input, type BaseInputProps } from "./Input";

type AirportInputProps = BaseInputProps & {
  value: AirportProperties | undefined;
  onChange?: (value: AirportProperties | undefined) => void;
};

export function AirportInput({ value, onChange, ...props }: AirportInputProps) {
  const [code, setCode] = useState(value?.displayCode || "");
  const [searchAirport, { data, isLoading, error }] =
    useLazyGetAirportByCodeQuery();

  useEffect(() => {
    if (code.length >= 3 && !value) {
      const timer = setTimeout(() => {
        searchAirport(code);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [code, searchAirport, value]);

  const handleSelect = (airport: AirportProperties) => {
    setCode(airport.displayCode);
    onChange?.(airport);
  };

  const handleClear = () => {
    setCode("");
    onChange?.(undefined);
  };

  if (value) {
    return (
      <div className="AirportSearch selected">
        <label>{props.label}</label>
        <div className="airport-pill">
          <span className="code">{value.displayCode}</span>
          <span className="name">{value.name}</span>
          <button type="button" onClick={handleClear} className="clear-button">
            x
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="AirportSearch">
      <Input type="text" onChange={(v) => setCode(v ?? "")} {...props} />

      {isLoading && <div className="loading">Searching...</div>}

      {error && code.length >= 3 && (
        <div className="error">No airport found for {code}</div>
      )}

      {data && !value && (
        <div className="airport-dropdown">
          <button
            type="button"
            onClick={() => handleSelect(toProperties(data))}
            className="airport-option"
            disabled={props.disabled}
          >
            <div className="airport-code">{data.displayCode}</div>
            <div className="airport-details">
              <div className="airport-name">{data.name}</div>
              <div className="airport-location">
                {data.city}, {data.isoCountry}
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

function toProperties(airport: Airport): AirportProperties {
  return {
    displayCode: airport.displayCode,
    name: airport.name,
    id: airport.id,
  };
}
