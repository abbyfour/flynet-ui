function random(...options: string[]) {
  return options[Math.floor(Math.random() * options.length)];
}

export const m = {
  confirm: {
    losingChanges: {
      title: "Lose unsaved changes?",
      text: "If you go back now, any changes you made will be ejected into space.",
    },
  },

  flight: {
    // addition
    couldNotBeAdded: "Flight could not be added — tower unresponsive.",
    addedSuccessfully: "Flight added — clear for takeoff.",

    // deletion

    confirmDeletion: {
      title: "Are you sure you want to delete this flight?",
      text: "You can always add it again if you miss it.",
    },
    couldNotBeDeleted: "Flight could not be deleted — server INOP.",
    deletedSuccessfully: () =>
      random(
        "Flight removed — the transponder’s gone dark",
        "Flight removed — route cleared from the FMS.",
        "Flight removed — returning to the gate.",
      ),

    // editing
    couldNotBeUpdated: "Flight could not be updated — check with ground crew.",
    updatedSuccessfully: "Flight updated — changes have been logged.",
  },

  statusBar: {
    message: (nickname: string) =>
      random(
        `Welcome back, ${nickname}.`,
        `${nickname}, sounds like you’re due for an altitude recovery procedure`,
      ),
  },
} as const;
