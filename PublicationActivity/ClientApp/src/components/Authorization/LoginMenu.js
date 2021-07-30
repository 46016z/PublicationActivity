import React, { Component, Fragment } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from '../../services/authorizeService';
import { ApplicationPaths } from '../../config/apiAuthorizationConstants';
import { withTranslation } from 'react-i18next';
import { format } from '../../utils';

class LoginMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            userName: null
        };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.populateState());
        this.populateState();
    }

    componentWillUnmount() {
        authService.unsubscribe(this._subscription);
    }

    async populateState() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
        this.setState({
            isAuthenticated,
            userName: user && user.name
        });
    }

    render() {
        const { isAuthenticated, userName } = this.state;
        if (!isAuthenticated) {
            const loginPath = `${ApplicationPaths.Login}`;
            return this.anonymousView(loginPath);
        } else {
            const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
            return this.authenticatedView(userName, logoutPath);
        }
    }

    authenticatedView(userName, logoutPath) {
        return (<Fragment>
            <NavItem>
                <div className="text-dark nav-link">{format(this.props.t('ui.greetingUser'), userName)}</div>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={logoutPath}>{this.props.t('ui.logout')}</NavLink>
            </NavItem>
        </Fragment>);

    }

    anonymousView(loginPath) {
        return (<Fragment>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={loginPath}>{this.props.t('ui.login')}</NavLink>
            </NavItem>
        </Fragment>);
    }
}

export default withTranslation()(LoginMenu);