import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const DeleteConfirmationModal = ({ isOpen, toggle, onDelete, title, message }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{title || 'Confirmar Exclusão'}</ModalHeader>
      <ModalBody>
        {message || 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.'}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onDelete}>
          Excluir
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteConfirmationModal;