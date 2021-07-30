import React from 'react'
import { Component } from 'react';
import authService from '../../services/authorizeService';
import { AuthenticationResultStatus } from '../../services/authorizeService';
import { QueryParameterNames, LogoutActions, ApplicationPaths } from '../../config/apiAuthorizationConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'reactstrap/lib/Spinner';
import { withTranslation } from 'react-i18next';

// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
class Logout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: undefined,
            isReady: false,
            authenticated: false
        };
    }

    componentDidMount() {
        const action = this.props.action;
        switch (action) {
            case LogoutActions.Logout:
                if (!!window.history.state.state.local) {
                    this.logout(this.getReturnUrl());
                } else {
                    // This prevents regular links to <app>/authentication/logout from triggering a logout
                    this.setState({ isReady: true, message: "The logout was not initiated from within the page." });
                }
                break;
            case LogoutActions.LogoutCallback:
                this.processLogoutCallback();
                break;
            case LogoutActions.LoggedOut:
                this.setState({ isReady: true, message: this.props.t('ui.loggedOut') });
                break;
            default:
                throw new Error(`Invalid action '${action}'`);
        }

        this.populateAuthenticationState();
    }

    renderLogoutScreen() {
        return (<div className={'centered-container'}>
            <div className={'text-center'}>
                <FontAwesomeIcon icon={faCheckCircle} color={'#28a745'} size={'5x'} />
                <p className={'mt-3'}>{this.props.t('ui.loggedOut')}</p>
            </div>
        </div>)
    }

    renderLoadingScreen(message) {
        return (<div className={'centered-container'}>
            <div className={'text-center'}>
                <Spinner style={{ width: '80px', height: '80px' }} color={'primary'} type={'grow'} />
                <p className={'mt-3'}>{message}</p>
            </div>
        </div>)
    }

    render() {
        const { isReady, message } = this.state;
        if (!isReady) {
            return <div></div>
        }
        if (!!message) {
            return message === this.props.t('ui.loggedOut') ? this.renderLogoutScreen() : this.renderLoadingScreen(message);
        } else {
            const action = this.props.action;
            switch (action) {
                case LogoutActions.Logout:
                    return this.renderLoadingScreen(this.props.t('ui.loggingOut'));
                case LogoutActions.LogoutCallback:
                    return this.renderLoadingScreen(this.props.t('ui.loggingOut'));
                case LogoutActions.LoggedOut:
                    return this.renderLogoutScreen();
                default:
                    throw new Error(`Invalid action '${action}'`);
            }
        }
    }

    async logout(returnUrl) {
        const state = { returnUrl };
        const isauthenticated = await authService.isAuthenticated();
        if (isauthenticated) {
            const result = await authService.signOut(state);
            switch (result.status) {
                case AuthenticationResultStatus.Redirect:
                    break;
                case AuthenticationResultStatus.Success:
                    await this.navigateToReturnUrl(returnUrl);
                    break;
                case AuthenticationResultStatus.Fail:
                    this.setState({ message: result.message });
                    break;
                default:
                    throw new Error("Invalid authentication result status.");
            }
        } else {
            this.setState({ message: this.props.t('ui.loggedOut') });
        }
    }

    async processLogoutCallback() {
        const url = window.location.href;
        const result = await authService.completeSignOut(url);
        switch (result.status) {
            case AuthenticationResultStatus.Redirect:
                // There should not be any redirects as the only time completeAuthentication finishes
                // is when we are doing a redirect sign in flow.
                throw new Error('Should not redirect.');
            case AuthenticationResultStatus.Success:
                await this.navigateToReturnUrl(this.getReturnUrl(result.state));
                break;
            case AuthenticationResultStatus.Fail:
                this.setState({ message: result.message });
                break;
            default:
                throw new Error("Invalid authentication result status.");
        }
    }

    async populateAuthenticationState() {
        const authenticated = await authService.isAuthenticated();
        this.setState({ isReady: true, authenticated });
    }

    getReturnUrl(state) {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get(QueryParameterNames.ReturnUrl);
        if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
            // This is an extra check to prevent open redirects.
            throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
        }
        return (state && state.returnUrl) ||
            fromQuery ||
            `${window.location.origin}${ApplicationPaths.LoggedOut}`;
    }

    navigateToReturnUrl(returnUrl) {
        return window.location.replace(returnUrl);
    }
}

export default withTranslation()(Logout);