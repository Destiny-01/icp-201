import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddProduct = ({ save, data }) => {
  const [title, setTitle] = useState(data?.title || "");
  const [attachmentURL, setImage] = useState(data?.avatar || "");
  const [description, setDescription] = useState(data?.description || "");
  const isFormFilled = () => title && attachmentURL && description;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {data ? (
        <Button onClick={handleShow} size="sm">
          Edit
        </Button>
      ) : (
        <Button
          onClick={handleShow}
          variant="dark"
          className="rounded-pill px-0 d-flex align-items-center justify-content-center"
          style={{ width: "36px", height: "36px" }}
        >
          <i className="bi bi-plus"></i>
        </Button>
      )}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Room</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel controlId="inputName" label="Title" className="mb-3">
              <Form.Control
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                value={title}
                placeholder="Enter title of room"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="Avatar URL"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Avatar URL"
                value={attachmentURL}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
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
                title,
                attachmentURL,
                description,
                location,
                price,
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

AddProduct.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddProduct;
