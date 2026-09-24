// Every asset is exported from the Figma frames; see README for node ids.
const a = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

export const assets = {
  logo: a("logo.png"),
  hero: a("hero.png"),
  singpassLogo: a("singpass-logo.png"),
  consentList: a("consent-list.png"),
  retrieveWithSingpass: a("retrieve-with-singpass.svg"),
  questionMark: a("question-mark.svg"),
  icDown: a("ic-down.svg"),
  icDownDisabled: a("ic-down-disabled.svg"),
  icDownTertiary: a("ic-down-tertiary.svg"),
  icUp: a("ic-up.svg"),
  icTick: a("ic-tick.svg"),
  info: a("info.svg"),
  infoAlert: a("info-alert.svg"),
  calendar: a("calendar.svg"),
  radioSelected: a("radio-selected.svg"),
  discount: a("discount.svg"),
  icClose: a("ic-close.svg"),
  icPlus: a("ic-plus.svg"),
  line111: a("line-111.svg"),
  popoverArrow: a("popover-arrow.svg"),
};
