import { Airport } from "@data/classes/flights/Airport";
import type { AirportDraft } from "@data/classes/flights/FlightDraft";
import {
  useLazyGetAirportByCodeQuery,
  useLazySearchAirportsQuery,
} from "@data/services/flights/flightsAPI";
import { Combobox, Loader, Pill, PillsInput, useCombobox } from "@mantine/core";
import { displayAirportType } from "@util/flights";
import { useMemo, useState } from "react";
import type { BaseInputProps } from "./Input";
import { InputLabel } from "./InputLabel";

type AirportInputProps = BaseInputProps & {
  value: AirportDraft | undefined;
  onChange?: (value: AirportDraft | undefined) => void;
};

export function AirportInput({
  value,
  onChange,
  fingerprinted,
  ...props
}: AirportInputProps) {
  const [code, setCode] = useState("");
  const normalizedCode = code.trim();
  const canSearch = normalizedCode.length >= 3;
  const shouldUseCodeSearch = /^[a-zA-Z]{3,4}$/.test(normalizedCode);

  const [
    searchAirportByCode,
    { data: airportDataByCode, isFetching: isFetchingByCode },
  ] = useLazyGetAirportByCodeQuery();
  const [searchAirports, { data: searchedAirports, isFetching: isSearching }] =
    useLazySearchAirportsQuery();

  const isLoading = isSearching || (shouldUseCodeSearch && isFetchingByCode);

  const searchResults = useMemo(() => {
    const byDisplayCode = new Map<string, Airport>();

    if (shouldUseCodeSearch && airportDataByCode) {
      byDisplayCode.set(airportDataByCode.displayCode, airportDataByCode);
    }

    for (const airport of searchedAirports || []) {
      byDisplayCode.set(airport.displayCode, airport);
    }

    return [...byDisplayCode.values()];
  }, [airportDataByCode, searchedAirports, shouldUseCodeSearch]);

  const combobox = useCombobox();
  const [initialValue] = useState(value);

  const hasValueChanged = () => {
    if (!fingerprinted) return false;

    return value?.displayCode !== initialValue?.displayCode;
  };

  const handleChange = (input: string) => {
    setCode(input);

    const normalizedInput = input.trim();

    if (normalizedInput.length >= 3) {
      combobox.openDropdown();

      if (normalizedInput.length === 3 || normalizedInput.length === 4) {
        searchAirportByCode(normalizedInput.toUpperCase());
      }

      searchAirports(normalizedInput);
    } else {
      combobox.closeDropdown();
    }
  };

  const handleSelect = (airport: AirportDraft) => {
    setCode("");
    onChange?.(airport);
    combobox.closeDropdown();
  };

  const handleClear = () => {
    setCode("");
    onChange?.(undefined);
  };

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        const selectedAirport = searchResults.find(
          (airport) => airport.displayCode === val,
        );

        if (selectedAirport) {
          handleSelect(toProperties(selectedAirport));
        }
      }}
    >
      <Combobox.Target>
        <PillsInput
          id={props.id}
          label={
            <InputLabel
              label={props.label}
              changed={hasValueChanged()}
              required={props.required}
            />
          }
          disabled={props.disabled}
          radius="xs"
          className="Input"
          rightSection={isLoading ? <Loader size="xs" /> : null}
        >
          <Pill.Group>
            {value && (
              <Pill withRemoveButton onRemove={handleClear}>
                <span style={{ fontWeight: "bold" }}>{value.displayCode}</span>{" "}
                | {value.name}
              </Pill>
            )}

            {!value && (
              <PillsInput.Field
                value={code}
                onChange={(e) => handleChange(e.currentTarget.value)}
                onFocus={() => canSearch && combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
              />
            )}
          </Pill.Group>
        </PillsInput>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {searchResults.length > 0 ? (
            searchResults.slice(0, 15).map((airport) => (
              <Combobox.Option
                key={airport.displayCode}
                value={airport.displayCode}
              >
                <strong>{airport.displayCode}</strong> — {airport.name}
                <div style={{ fontSize: "0.8em", color: "gray" }}>
                  {displayAirportType(airport.type)} • {airport.city},{" "}
                  {airport.isoCountry}
                </div>
              </Combobox.Option>
            ))
          ) : (
            <Combobox.Empty>
              {canSearch
                ? isLoading
                  ? "Searching..."
                  : "No airport found"
                : "Type at least 3 characters..."}
            </Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

function toProperties(airport: Airport): AirportDraft {
  return {
    displayCode: airport.displayCode,
    name: airport.name,
    id: airport.id,
  };
}
