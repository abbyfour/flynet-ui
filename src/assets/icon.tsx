import globe from "./globe.svg";
import mercator from "./mercator.svg";

const icons = {
  globe: {
    src: globe,
    alt: "globe icon",
  },
  mercator: {
    src: mercator,
    alt: "mercator icon",
  },
};

type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  width?: number;
  height?: number;
};

export function Icon({ name, width = 24, height = 24 }: IconProps) {
  const icon = icons[name];
  return <img src={icon.src} alt={icon.alt} width={width} height={height} />;
}
