/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { hot } from 'react-hot-loader/root';
import thunk from 'redux-thunk';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@superset-ui/core';
import { GlobalStyles } from 'src/GlobalStyles';
import messageToastReducer from 'src/components/MessageToasts/reducers';
import { initEnhancer } from 'src/reduxUtils';
import ToastContainer from 'src/components/MessageToasts/ToastContainer';
import setupApp from '../setup/setupApp';
import setupPlugins from '../setup/setupPlugins';
import { DynamicPluginProvider } from '../components/DynamicPlugins';
import AddSliceContainer from './AddSliceContainer';
import { initFeatureFlags } from '../featureFlags';
import { theme } from '../preamble';

setupApp();
setupPlugins();

const addSliceContainer = document.getElementById('app');
const bootstrapData = JSON.parse(
  addSliceContainer?.getAttribute('data-bootstrap') || '{}',
);

const store = createStore(
  combineReducers({
    messageToasts: messageToastReducer,
  }),
  {},
  compose(applyMiddleware(thunk), initEnhancer(false)),
);

initFeatureFlags(bootstrapData.common.feature_flags);

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <DynamicPluginProvider>
        <AddSliceContainer user={bootstrapData.user} />
        <ToastContainer />
      </DynamicPluginProvider>
    </ThemeProvider>
  </Provider>
);

export default hot(App);
