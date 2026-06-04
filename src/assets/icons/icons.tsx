import PlaneIcon from "@assets/icons/plane.svg?react";
import {
  IconArrowRight,
  IconArrowsLeftRight,
  IconCalendar,
  IconCheck,
  IconChevronLeft,
  IconExternalLink,
  IconHome2Filled,
  IconLogout2,
  IconPencil,
  IconPlaneArrivalFilled,
  IconPlaneDepartureFilled,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

export const icons = {
  actions: {
    edit: (size = 16) => <IconPencil size={size} />,
    delete_: (size = 16) => <IconTrash size={size} />,
    submit: (size = 16) => <IconCheck size={size} />,
    logout: (size = 16) => <IconLogout2 size={size} />,
    externalLink: (size = 16) => <IconExternalLink size={size} />,

    window: {
      back: (size = 16) => <IconChevronLeft size={size} />,
      close: (size = 16) => <IconX size={size} />,
      home: (size = 16) => <IconHome2Filled size={size} />,
    },
  },

  flights: {
    departure: (size = 16) => <IconPlaneDepartureFilled size={size} />,
    arrival: (size = 16) => <IconPlaneArrivalFilled size={size} />,
    date: (size = 16) => <IconCalendar size={size} />,
    flightRoute: (size = 16) => <IconArrowRight size={size} />,
    route: (size = 16) => <IconArrowsLeftRight size={size} />,

    plane: ({ size = 16 }) => <PlaneIcon width={size} height={size} />,
  },
} as const;
