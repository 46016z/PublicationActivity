import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { ApplicationPaths, QueryParameterNames } from '../../config/apiAuthorizationConstants'
import authService from '../../services/authorizeService'

export default ({ component: Component, path, ...rest }) => {
    const [ready, setReady] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const authenticationChangedSubscriptionRef = useRef();

    const authenticationChanged = useCallback(async () => {
        setAuthenticated(false);
        setReady(false);

        await populateAuthenticationState();
    }, []);

    useEffect(() => {
        (async () => {
            authenticationChangedSubscriptionRef.current = authService.subscribe(() => authenticationChanged());
            await populateAuthenticationState();
        })();

        return () => authService.unsubscribe(authenticationChangedSubscriptionRef.current);
    }, [authenticationChanged]);

    const populateAuthenticationState = async () => {
        const authenticated = await authService.isAuthenticated();

        setAuthenticated(authenticated);
        setReady(true);
    }

    const link = document.createElement("a");
    link.href = path;
    const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
    const redirectUrl = `${ApplicationPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURI(returnUrl)}`;

    return !ready ? (<div></div>) : (
        <Route {...rest}
            render={(props) => {
                if (authenticated) {
                    return <Component {...props} />
                } else {
                    return <Redirect to={redirectUrl} />
                }
            }} />
    );
};
