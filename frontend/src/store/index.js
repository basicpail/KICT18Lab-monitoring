import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import deviceReducer from './deviceSlice';
//userSlice.js에서 userSlice.reducer를 default 로 export 했기 때문에 여기서 userReducer로 import 할 수 있는거다?
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from 'redux-persist';
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
    user: userReducer,
    device: deviceReducer
})

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        //action에 직렬화(object를 string 값으로 변환 JSON.stringify)불가능한 값이 오면 에러가 나도록 함(예를들어 함수를 액션으로 전달한다면..)
        serializableCheck: { 
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER ]
        }
    })
})
//리덕스를 사용해줄려면은 프로바이더 컴포넌트로 사용을 할 (리덕스 스토어의 스테이트를 사용을 할) 컴포넌트들을 감싸줘야한다?..
//main.jsx에서 설정함

export const persistor = persistStore(store);