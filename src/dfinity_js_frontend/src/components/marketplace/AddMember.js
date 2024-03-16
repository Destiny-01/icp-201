import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddMember = ({ save }) => {
  const [address, setAddress] = useState("");
  const [show, setShow] = useState(false);
  const isFormFilled = () => !!address;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} variant="secondary" size="sm">
        Add Member
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Member</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Address"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                value={address}
                placeholder="Enter their address"
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                address,
              });
              handleClose();
            }}
          >
            Save product
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddMember.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddMember;
