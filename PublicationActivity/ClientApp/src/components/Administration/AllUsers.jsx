import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col } from 'reactstrap';
import apiService from '../../services/apiService';
import notificationsService from '../../services/notificationsService';
import { useTranslation } from 'react-i18next';

const AllUsers = () => {
    const { t } = useTranslation();

    const [isOperationInProgress, setIsOperationInProgress] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            setUsers(await apiService.getAllUsers());
        })();
    }, []);

    const resetUserPassword = async (userEmail) => {
        setIsOperationInProgress(true);

        try {
            await apiService.resetUserPassword(userEmail);

            notificationsService.success(t('ui.passwordResetSuccessfully'));
        } catch (err) {
            const errorMessage = err.exceptionType ? t(err.exceptionType) : err.message;
            notificationsService.error(errorMessage);
        }

        setIsOperationInProgress(false);
    };

    const properties = !!(users && users.length) ? Object.keys(users[0]) : {};

    return (
        <>
            <Row>
                <Col className={'mb-3'}>
                    <h2>{t('ui.previewUsers')}</h2>
                </Col>
            </Row>
            <Row>
                <Col className={'mb-3'}>
                    <div style={{
                        maxWidth: '100%',
                        overflowX: 'auto'
                    }}>
                        {!!(users && users.length) && <Table bordered>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {properties.map((p, i) => (<th key={i}>{t(`user.fields.${p}`)}</th>))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => (
                                    <tr key={i}>
                                        <th scope="row">{i + 1}</th>
                                        {properties.map((p, pi) => (<td key={pi}>{u[p]}</td>))}
                                        <td key={properties.length}><Button color={'primary'} disabled={isOperationInProgress} onClick={() => resetUserPassword(u.email)}>{t('ui.resetUserPassword')}</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>}
                    </div>
                </Col>
            </Row>
        </>
    );
};

export { AllUsers };
