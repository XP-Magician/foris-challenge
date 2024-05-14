import kleur from "kleur";

// Styles
const styles = {
  WARN_TITLE: kleur.bold().bgYellow().underline,
  INFO_TITLE: kleur.bold().bgGreen().underline,
  INDICATOR: kleur.bold().yellow,
  TEXT: kleur.white,
};

// Utilities
const print = (title, style) => {
  const writter = styles[style];
  console.log(writter(title));
};

// Exports
export default print;
