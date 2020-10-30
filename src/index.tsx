import React, {FC} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import './index.css';
import rootReducer from './reducers';
import reportWebVitals from './reportWebVitals';
import MainRoute from './routes/MainRoute';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/core';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/rootSaga';

const theme = createMuiTheme({      
  typography: {
    button: {
      textTransform: 'none'
    }
  }
});
const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

const App: FC = () => {
	return (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<React.Fragment>
			    <MainRoute />
			  </React.Fragment>
			</ThemeProvider>
		</Provider>
	);
}
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
