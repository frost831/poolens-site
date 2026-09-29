import { route } from '../../editorial/render.mjs';

export function onRequest(context) {
  return route(context.request) || context.next();
}
