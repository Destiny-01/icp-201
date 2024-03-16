import React from "react";
import AddProduct from "./AddProduct";

function Sidebar() {
  const addProduct = async (data) => {
    try {
      setLoading(true);
      const priceStr = data.price;
      data.price = parseInt(priceStr, 10);
      createProduct(data).then((resp) => {
        getProducts();
      });
      toast(<NotificationSuccess text="Product added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a product." />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar">
      <section className="d-flex align-items-center justify-content-between">
        <div></div>
        <h4>Your Rooms</h4>
        <AddProduct save={addProduct} />
      </section>
      <div>
        <p className="title">Party room</p>
        <p>2 participants</p>
      </div>
    </div>
  );
}

export default Sidebar;
