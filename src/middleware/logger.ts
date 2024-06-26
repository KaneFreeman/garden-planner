import { Middleware } from 'redux';

const logger: Middleware = (store) => (next) => (action: any) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.info('next state', store.getState());
  console.groupEnd();
  return result;
};

export default logger;
