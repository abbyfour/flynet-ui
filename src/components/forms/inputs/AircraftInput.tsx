import { Aircraft } from "@data/classes/flights/Aircraft";
import type {
  AircraftDraft,
  AirportDraft,
} from "@data/classes/flights/FlightDraft";
import {
  useLazyGetAircraftByCodeQuery,
  useLazySearchAircraftQuery,
} from "@data/services/flights/flightsAPI";
import { Combobox, Loader, Pill, PillsInput, useCombobox } from "@mantine/core";
import { useMemo, useState } from "react";
import type { BaseInputProps } from "../Input";
import { InputLabel } from "../InputLabel";

type AircraftInputProps = BaseInputProps & {
  value: AirportDraft | undefined;
  onChange?: (value: AirportDraft | undefined) => void;
};

export function AircraftInput({
  value,
  onChange,
  fingerprinted,
  ...props
}: AircraftInputProps) {
  const [code, setCode] = useState("");
  const normalizedCode = code.trim();
  const canSearch = normalizedCode.length >= 3;
  const shouldUseCodeSearch = /^[a-zA-Z]{3,4}$/.test(normalizedCode);

  const [
    searchAirportByCode,
    { data: aircraftDataByCode, isFetching: isFetchingByCode },
  ] = useLazyGetAircraftByCodeQuery();
  const [searchAircraft, { data: searchedAircraft, isFetching: isSearching }] =
    useLazySearchAircraftQuery();

  const isLoading = isSearching || (shouldUseCodeSearch && isFetchingByCode);

  const searchResults = useMemo(() => {
    const byId = new Map<number, Aircraft>();

    if (shouldUseCodeSearch && aircraftDataByCode) {
      byId.set(aircraftDataByCode.id, aircraftDataByCode);
    }

    for (const aircraft of searchedAircraft || []) {
      byId.set(aircraft.id, aircraft);
    }

    return [...byId.values()];
  }, [aircraftDataByCode, searchedAircraft, shouldUseCodeSearch]);

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

      searchAircraft(normalizedInput);
    } else {
      combobox.closeDropdown();
    }
  };

  const handleSelect = (aircraft: AircraftDraft) => {
    setCode("");
    onChange?.(aircraft);
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
        const selectedAircraft = searchResults.find(
          (aircraft) => String(aircraft.id) === val,
        );

        if (selectedAircraft) {
          handleSelect(toProperties(selectedAircraft));
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
            searchResults.slice(0, 15).map((aircraft) => (
              <Combobox.Option
                key={aircraft.id}
                value={String(aircraft.id)}
              >
                {aircraft.manufacturerModel}{" "}
                <span
                  style={{
                    color: "var(--grey)",
                    fontWeight: "var(--weight-semibold)",
                  }}
                >
                  ({aircraft.displayCode})
                </span>
                <div style={{ fontSize: "0.8em", color: "gray" }}>
                  {aircraft.aircraftClass} • Introduced{" "}
                  {aircraft.yearIntroduced}
                </div>
              </Combobox.Option>
            ))
          ) : (
            <Combobox.Empty>
              {canSearch
                ? isLoading
                  ? "Searching..."
                  : "No aircraft found"
                : "Type at least 3 characters..."}
            </Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

function toProperties(aircraft: Aircraft): AircraftDraft {
  return {
    displayCode: aircraft.displayCode,
    name: aircraft.manufacturerModel,
    id: aircraft.id,
  };
}
