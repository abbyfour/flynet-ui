export type RGB = [number, number, number];
export type RGBA = [number, number, number, number];

export const colours = {
  yellow: [255, 200, 0],
  red: [211, 47, 0],
  darkRed: [211, 47, 0],

  white: [255, 255, 255],
  black: [0, 0, 0],
} satisfies Record<string, RGB>;

export type ColourKey = keyof typeof colours;

export type ThemedColourKey = {
  light: ColourKey;
  dark: ColourKey;
};

export const colourRoles = {
  flightLine: { light: "red", dark: "yellow" },
  flightLineHighlight: { light: "darkRed", dark: "white" },
  airportDot: { light: "black", dark: "white" },
} satisfies Record<string, ColourKey | ThemedColourKey>;

export type ColourRole = keyof typeof colourRoles;

export function isThemedKey(
  key: ColourKey | ThemedColourKey,
): key is ThemedColourKey {
  return typeof key !== "string";
}
