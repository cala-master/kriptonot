export interface MaskedFragmentViewState {
  fragmentId: string;
  isLocked: boolean;
  displayValue: string;
}

export interface RevealMaskedFragmentAction {
  fragmentId: string;
  interaction: "click" | "unlock";
}
