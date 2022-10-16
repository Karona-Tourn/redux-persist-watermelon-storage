# redux-persist-watermelon-storage
Watermelon storage for redux persist
## Installation

Make you sure you also install [WatermelonDB](https://nozbe.github.io/WatermelonDB/Installation.html) into your project.

Npm
```sh
npm install redux-persist-watermelon-storage
```

Yarn
```sh
yarn add redux-persist-watermelon-storage
```

## Usage

```js
import { persistReducer } from 'redux-persist';
import { createWatermelonStorage } from 'redux-persist-watermelon-storage';

const persistConfig = {
  key: 'root',
  storage: createWatermelonStorage()
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
```

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
