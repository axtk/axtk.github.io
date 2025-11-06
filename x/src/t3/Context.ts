import { Store } from "@t8/store";
import { State } from "./State";

export type Context = {
  container: HTMLElement;
  store: Store<State>;
};
