import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'

//PersistGate는 redux 스토어에서 지속 데이터를 사용할 수 있을 때까지의 앱 UI 렌더링을 지연할 수 있다. 이를 위해 redux persist 에는 persistGate 구성 요소가 포함되어 있다.
//페이지가 리프레쉬 되면 리덕스 스토어가 되어 있는 값들이 초기화 되는데 그러지 않고 로컬 스토리지에 저장된 값들을 가져와서 다시 넣어주는것이다(이게 REHYDRATE?). 그 값을 가져올 때 까지 렌더링을 지연시켜주는게 persistGate이다.
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
