import { type Config, transform } from "glyphmap";
import { escapeHTML } from "stfm";

const STRESS_MARK = "\u0301";

export function transformInput(x: string, config: Config) {
  let { inputGlyphs, outputGlyphs } = transform(x, config);
  let partialOutput = "",
    output = "",
    uppercaseOutput = "";

  for (let i = 0; i < outputGlyphs.length; i++) {
    let inputGlyph = inputGlyphs[i],
      nextInputGlyph = inputGlyphs[i + 1];
    let outputGlyph = outputGlyphs[i];

    if (inputGlyph === STRESS_MARK) continue;

    /*if (inputGlyph === '\n') {
            let escapedPartialOutput = escapeHTML(partialOutput);

            output += `${escapedPartialOutput}<br>`;
            uppercaseOutput += `${escapedPartialOutput.toUpperCase()}<br>`;

            partialOutput = '';
        }
        else*/ if (nextInputGlyph === STRESS_MARK) {
      let escapedPartialOutput = escapeHTML(partialOutput);
      let escapedGlyph = escapeHTML(outputGlyph);

      output += `${escapedPartialOutput}<u>${escapedGlyph}</u>`;
      uppercaseOutput += `${escapedPartialOutput.toUpperCase()}<u>${escapedGlyph.toUpperCase()}</u>`;

      partialOutput = "";
    } else partialOutput += outputGlyph;
  }

  if (partialOutput) {
    let escapedPartialOutput = escapeHTML(partialOutput);

    output += escapedPartialOutput;
    uppercaseOutput += escapedPartialOutput.toUpperCase();
  }

  let unstressedInput = x.replaceAll(STRESS_MARK, "");

  return {
    output,
    uppercaseOutput,
    unstressedInput,
  };
}
