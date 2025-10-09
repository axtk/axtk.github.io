import type { DictionaryKey } from "./DictionaryKey";

export type MatchedItem = {
  term: string;
  def: string;
  htmlTerm?: string;
  htmlDef?: string;
  dictionaryKey: DictionaryKey;
  expressionIndex: number;
  relevance?: number;
};
