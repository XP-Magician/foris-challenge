import kleur from "kleur";

// Styles
const styles = {
  WARN_TITLE: kleur.bold().bgYellow(),
  INFO_TITLE: kleur.bold().bgGreen(),
  INDICATOR: kleur.bold().yellow(),
  TEXT: kleur.white(),
};

// Utilities
const print = (title, style) => {
  const writter = styles[style];
  console.log(writter.underline(title));
};

// Exports
export default print;
