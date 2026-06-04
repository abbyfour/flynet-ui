export type RGB = [number, number, number];
export type RGBA = [number, number, number, number];

export const colours = {
  flynetYellow: [255, 183, 0],
  flynetRed: [255, 84, 84],
  flynetTeal: [56, 211, 242],

  white: [255, 255, 252],
  black: [30, 30, 30],
} satisfies Record<string, RGB>;

export type ColourKey = keyof typeof colours;

export type ThemedColourKey = {
  light: ColourKey;
  dark: ColourKey;
};

export const colourRoles = {
  primaryText: { light: "black", dark: "white" },

  flightLine: { light: "flynetRed", dark: "flynetYellow" },
  flightLineHighlight: { light: "black", dark: "white" },
  flightLineUpcoming: "flynetTeal",
  airportDot: { light: "black", dark: "white" },
} satisfies Record<string, ColourKey | ThemedColourKey>;

export type ColourRole = keyof typeof colourRoles;

export function isThemedKey(
  key: ColourKey | ThemedColourKey,
): key is ThemedColourKey {
  return typeof key !== "string";
}
