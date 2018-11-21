import { push } from 'react-router-redux-fixed';

export function changeLocation(path) {
  return push(path);
}
