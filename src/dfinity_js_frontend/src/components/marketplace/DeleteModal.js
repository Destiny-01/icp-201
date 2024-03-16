import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";

const DeleteModal = ({ save }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} variant="danger" size="sm">
        Delete
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This is permanent. Are you sure?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              save();
              handleClose();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DeleteModal.propTypes = {
  save: PropTypes.func.isRequired,
};

export default DeleteModal;
