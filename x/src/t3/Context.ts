import type { Store } from "@t8/store";
import type { State } from "./State";

export type Context = {
  container: HTMLElement;
  store: Store<State>;
};
