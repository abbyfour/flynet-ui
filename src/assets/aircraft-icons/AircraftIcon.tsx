import type { ReactElement, SVGProps } from "react";
import UnidentifiedIcon from "./svg/Unidentified.svg?react";

interface AircraftIconProps {
  icaoCode?: string;
  className?: string;
  ariaLabel?: string;
}

type SvgComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

const svgModules = import.meta.glob("./svg/*.svg", {
  eager: true,
  import: "default",
  query: "?react",
}) as Record<string, SvgComponent>;

const svgByCode = Object.entries(svgModules).reduce<
  Record<string, SvgComponent>
>((acc, [path, icon]) => {
  const fileName = path.split("/").pop();
  if (!fileName) return acc;

  const code = fileName.replace(/\.svg$/i, "").toUpperCase();
  acc[code] = icon;
  return acc;
}, {});

function normalizeIcaoCode(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

const normalizedSvgByCode = Object.entries(svgByCode).reduce<
  Record<string, SvgComponent>
>((acc, [code, icon]) => {
  acc[normalizeIcaoCode(code)] = icon;
  return acc;
}, {});

const searchableCodes = Object.keys(normalizedSvgByCode)
  .filter((code) => code !== "UNIDENTIFIED")
  .sort((a, b) => b.length - a.length);

function resolveIconCode(icaoCode: string): string {
  const normalizedInput = normalizeIcaoCode(icaoCode);
  if (!normalizedInput) return "UNIDENTIFIED";

  if (normalizedSvgByCode[normalizedInput]) return normalizedInput;

  const partialCode = searchableCodes.find((code) =>
    normalizedInput.includes(code),
  );
  if (!partialCode) return "UNIDENTIFIED";

  return partialCode;
}

export function AircraftIcon({
  icaoCode,
  className,
  ariaLabel,
}: AircraftIconProps) {
  const lookupText = icaoCode ?? "";
  const iconCode = resolveIconCode(lookupText);
  const Icon =
    normalizedSvgByCode[iconCode] ??
    normalizedSvgByCode.UNIDENTIFIED ??
    UnidentifiedIcon;
  const label = ariaLabel ?? (lookupText || "UNIDENTIFIED");

  return <Icon className={className} aria-label={label} role="img" />;
}
