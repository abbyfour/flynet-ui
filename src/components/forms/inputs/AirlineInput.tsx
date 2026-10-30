import type { Airline } from "@data/classes/flights/Airline";
import type { AirlineDraft } from "@data/classes/flights/FlightDraft";
import {
  useLazyGetAirlineByCodeQuery,
  useLazySearchAirlineQuery,
} from "@data/services/flights/flightsAPI";
import { Combobox, Loader, Pill, PillsInput, useCombobox } from "@mantine/core";
import { useMemo, useState } from "react";
import type { BaseInputProps } from "../Input";
import { InputLabel } from "../InputLabel";

type AirlineInputProps = BaseInputProps & {
  value: AirlineDraft | undefined;
  onChange?: (value: AirlineDraft | undefined) => void;
};

export function AirlineInput({
  value,
  onChange,
  fingerprinted,
  ...props
}: AirlineInputProps) {
  const [code, setCode] = useState("");
  const normalizedCode = code.trim();
  const canSearch = normalizedCode.length >= 3;
  const shouldUseCodeSearch = /^[a-zA-Z0-9]{2,3}$/.test(normalizedCode);

  const [
    searchAirportByCode,
    { data: airlineDataByCode, isFetching: isFetchingByCode },
  ] = useLazyGetAirlineByCodeQuery();
  const [searchAircraft, { data: searchedAirlines, isFetching: isSearching }] =
    useLazySearchAirlineQuery();

  const isLoading = isSearching || (shouldUseCodeSearch && isFetchingByCode);

  const searchResults = useMemo(() => {
    const query = normalizedCode.toUpperCase();
    const matchesCode = (airline: Airline) =>
      airline.iataCode?.toUpperCase() === query ||
      airline.icaoCode?.toUpperCase() === query;

    const byId = new Map<number, Airline>();

    // The by-code result can be stale from an earlier, shorter query
    if (airlineDataByCode && matchesCode(airlineDataByCode)) {
      byId.set(airlineDataByCode.id, airlineDataByCode);
    }

    for (const airline of searchedAirlines || []) {
      byId.set(airline.id, airline);
    }

    // Exact code matches first; sort is stable so the rest keep API order
    return [...byId.values()].sort(
      (a, b) => Number(matchesCode(b)) - Number(matchesCode(a)),
    );
  }, [airlineDataByCode, searchedAirlines, normalizedCode]);

  const combobox = useCombobox();
  const [initialValue] = useState(value);

  const hasValueChanged = () => {
    if (!fingerprinted) return false;

    return value?.displayCode !== initialValue?.displayCode;
  };

  const handleChange = (input: string) => {
    setCode(input);

    const normalizedInput = input.trim();

    if (normalizedInput.length >= 2) {
      combobox.openDropdown();

      if (normalizedInput.length === 2 || normalizedInput.length === 3) {
        searchAirportByCode(normalizedInput.toUpperCase());
      }

      searchAircraft(normalizedInput);
    } else {
      combobox.closeDropdown();
    }
  };

  const handleSelect = (airline: AirlineDraft) => {
    setCode("");
    onChange?.(airline);
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
        const selectedAirline = searchResults.find(
          (airline) => String(airline.id) === val,
        );

        if (selectedAirline) {
          handleSelect(toProperties(selectedAirline));
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
            searchResults.slice(0, 15).map((airline) => (
              <Combobox.Option key={airline.id} value={String(airline.id)}>
                {airline.name}{" "}
                <span
                  style={{
                    color: "var(--grey)",
                    fontWeight: "var(--weight-semibold)",
                  }}
                >
                  ({airline.displayCode})
                </span>
                {airline.alternateNames.length > 0 && (
                  <div style={{ fontSize: "0.8em", color: "gray" }}>
                    {airline.alternateNames.join(", ")}
                  </div>
                )}
              </Combobox.Option>
            ))
          ) : (
            <Combobox.Empty>
              {canSearch
                ? isLoading
                  ? "Searching..."
                  : "No airlines found"
                : "Type at least 3 characters..."}
            </Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

function toProperties(airline: Airline): AirlineDraft {
  return {
    displayCode: airline.displayCode,
    name: airline.name,
    id: airline.id,
  };
}
