import { AppTheme } from "../../../data/classes/ui";
import { useAppSelector } from "../../../data/store";
import {
  colourRoles,
  colours,
  isThemedKey,
  type ColourKey,
  type ColourRole,
  type RGB,
  type ThemedColourKey,
} from "./colours";

type UseColourRecord = Record<`${ColourRole}Colour`, RGB>;

/** Uses the theme in storage to return the right colours for rendering */
export function useColours(): UseColourRecord {
  const theme = useAppSelector((state) => state.ui.theme);

  const returns = (
    Object.entries(colourRoles) as [ColourRole, ColourKey | ThemedColourKey][]
  ).reduce((acc, [role, colourDef]) => {
    let colourKey: ColourKey;

    if (isThemedKey(colourDef)) {
      colourKey = theme === AppTheme.Dark ? colourDef.dark : colourDef.light;
    } else {
      colourKey = colourDef;
    }
    acc[`${role}Colour`] = colours[colourKey];
    return acc;
  }, {} as UseColourRecord);

  return returns;
}
