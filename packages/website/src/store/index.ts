import { createStore, applyMiddleware, Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

let middleware: Array<Middleware> = [];
if (process.env.NODE_ENV !== 'production') {
  middleware = [createLogger(), ...middleware];
}

const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;
