/**
 * Created by Masa on 24-Jan-17.
 */
import React from 'react';
import {Route} from 'react-router';
import Main from './components/Gameplay/Main';
import Login from './components/Login/Login';
import App from './components/App/App';
import Lobby from './components/Lobby/Lobby';
import Home from './components/Home/Home';
import Auth from './Auth';
import EnsureAuthContainer from './components/EnsureAuthContainer/EnsureAuthContainer';

export default (
    <Route component={App}>
        <Route path="/" getComponent={(location, callback) => {
            if (Auth.isUserAuthenticated()) {
                callback(null, Home);
            } else {
                callback(null, Login);
            }
        }} />
        <Route component={EnsureAuthContainer}>
            <Route path="/game" component={Main} />
            <Route path="/lobby" component={Lobby} />
            <Route path='/logout' onEnter={(nextState, replace) => {
                Auth.deauthenticateUser();
                replace('/');
            }} />
        </Route>
    </Route>
)
