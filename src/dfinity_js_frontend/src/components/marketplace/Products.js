import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddProduct from "./AddProduct";
import Product from "./Product";
import Loader from "../utils/Loader";
import { Button, Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getProducts as getProductList,
  createProduct,
  buyProduct,
} from "../../utils/marketplace";
import Wallet from "../Wallet";
import Sidebar from "./Sidebar";
import Img from "../../assets/img/sandwich.jpg";
import DeleteModal from "./DeleteModal";
import AddMember from "./AddMember";

const Products = (tokenSymbol) => {
  // const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of products
  // const getProducts = useCallback(async () => {
  //   try {
  //     setLoading(true);
  // setProducts(await getProductList());
  // } catch (error) {
  //   console.log({ error });
  // } finally {
  // setLoading(false);
  //   }
  // });

  // Generate a random ID (assuming it's a string)
  const id =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Generate a random price (assuming it's a number)
  const price = Math.floor(Math.random() * 1000); // Generates a random number between 0 and 999

  // Generate random strings for title and description
  const title = "Random Title";
  const description = "Random Description";

  // Generate random location (assuming it's a string)
  const location = "Random Location";

  // Generate a random attachment URL (assuming it's a string)
  const attachmentURL = "https://example.com/image.jpg";

  // Generate a random seller (assuming it's a string)
  const seller = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  // Generate a random sold amount (assuming it's a number)
  const soldAmount = Math.floor(Math.random() * 100); // Generates a random number between 0 and 99

  // Now you can use these variables in your object
  const randomObject = {
    id,
    price,
    title,
    description,
    location,
    attachmentURL,
    seller,
    soldAmount,
  };

  const products = [randomObject, randomObject];

  const buy = async (id, price) => {
    try {
      setLoading(true);
      await buyProduct({
        id,
        price,
      }).then((resp) => {
        getProducts();
        toast(<NotificationSuccess text="Product bought successfully" />);
      });
    } catch (error) {
      toast(<NotificationError text="Failed to purchase product." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // getProducts();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex">
            <Sidebar />
            {true ? (
              <div className="chat mt-0">
                <div className="chat-header">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <img src={Img} alt="img" height={24} width={24} />
                      <p className="room-title">Title</p>
                      <p>&bull; </p>
                      <p>2 Members</p>
                    </div>
                    <div className="d-flex gap-3">
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Doloremque fugiat impedit magnam minus accusantium quos
                        ea
                      </p>
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <AddMember />
                    <div className="d-flex gap-1">
                      <AddProduct />
                      <DeleteModal />
                    </div>
                  </div>
                </div>
                <div className="chat-room pt-4">
                  <div className="d-flex justify-content-end">
                    <div className="message">
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Labore, aut!
                      </p>
                      <div className="d-flex align-items-center gap-1">
                        <p className="small">1493-fks-odpd</p> &bull;{" "}
                        <p className="small">2nd Mar, 2023</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chat-footer">
                  <input type="text" placeholder="Type your message here..." />
                  <i className="bi send bi-send"></i>
                </div>
              </div>
            ) : (
              <p className="text-center">
                Welcome <br /> Select a room from the left or create one and
                begin chatting
              </p>
            )}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Products;
