import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

let middleware: Array<Middleware> = [];
if (process.env.NODE_ENV !== 'production') {
  middleware = [createLogger(), ...middleware];
}

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
