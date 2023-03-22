import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

function createTerm(ref, termConfig: object = {}) {
  const config = {
    cols: 150
  };
  const term = new Terminal({ ...config, ...termConfig });
  const pingFitAddon = new FitAddon();

  term.loadAddon(pingFitAddon);
  term.open(ref.current);
  term.clear();
  pingFitAddon.fit();
  term.focus();

  return term;
}

export { createTerm };
