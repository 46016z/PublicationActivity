import React from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

const Prompt = ({ isOpen, configuration }) => (
    <Modal isOpen={isOpen}>
        <ModalBody>
            {configuration.message}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={configuration.confirm.handler}>{configuration.confirm.label}</Button>{' '}
          <Button color="secondary" onClick={configuration.decline.handler}>{configuration.decline.label}</Button>
        </ModalFooter>
      </Modal>
  );

export { Prompt };