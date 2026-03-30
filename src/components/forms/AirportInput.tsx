import { Airport } from "@data/classes/flights/Airport";
import type { AirportDraft } from "@data/classes/flights/FlightDraft";
import { useLazyGetAirportByCodeQuery } from "@data/services/flights/flightsAPI";
import { Combobox, Loader, Pill, PillsInput, useCombobox } from "@mantine/core";
import { useState } from "react";
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
  const [searchAirport, { data, isLoading }] = useLazyGetAirportByCodeQuery();
  const combobox = useCombobox();
  const [initialValue] = useState(value);

  const hasValueChanged = () => {
    if (!fingerprinted) return false;

    return value?.displayCode !== initialValue?.displayCode;
  };

  const handleChange = (input: string) => {
    setCode(input);
    combobox.openDropdown();

    if (input.length >= 3) {
      searchAirport(input);
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
        if (data && data.displayCode === val) {
          handleSelect(toProperties(data));
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
                {value.displayCode} — {value.name}
              </Pill>
            )}
            {!value && (
              <PillsInput.Field
                value={code}
                onChange={(e) => handleChange(e.currentTarget.value)}
                onFocus={() => data && combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
              />
            )}
          </Pill.Group>
        </PillsInput>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {data ? (
            <Combobox.Option value={data.displayCode}>
              <strong>{data.displayCode}</strong> — {data.name}
              <div style={{ fontSize: "0.8em", color: "gray" }}>
                {data.city}, {data.isoCountry}
              </div>
            </Combobox.Option>
          ) : (
            <Combobox.Empty>
              {code.length >= 3 ? "No airport found" : "Type to search..."}
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
