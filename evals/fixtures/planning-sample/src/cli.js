import {aggregate} from './engine.js';
import {format} from './report.js';
import {metrics} from './metrics.js';
export function run(records) {
  const output = aggregate(records);
  return {text: format(output), metrics: metrics(output)};
}
