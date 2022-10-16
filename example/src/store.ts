import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import { rootReducer } from './reducer';
import { createWatermelonStorage } from 'redux-persist-watermelon-storage';
import { setAutoFreeze, enableMapSet } from 'immer';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import immutableTransform from 'redux-persist-transform-immutable';

enableMapSet();
setAutoFreeze(false);

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage: createWatermelonStorage(),
  transforms: [
    immutableTransform(),
    encryptTransform({
      secretKey: '20221015',
      onError: function (error) {
        console.warn(error);
      },
    }),
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configureStore = () => {
  const middlewares = [];

  if (__DEV__) {
    const createDebugger = require('redux-flipper').default;
    middlewares.push(createDebugger());
  }

  const enhancers = applyMiddleware(...middlewares);

  const store = createStore(persistedReducer, enhancers);
  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
};
