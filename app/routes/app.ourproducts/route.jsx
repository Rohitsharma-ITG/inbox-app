import { useEffect, useState } from "react";
import {
  Card,
  Layout,
  Page,
  Spinner,
  TextField,
  Text,
  ResourceList,
  ResourceItem,
  Avatar,
} from "@shopify/polaris";
import "./products.css";

export default function updateCollection() {
  const [products, setCollections] = useState([]);
  const [fullfilled, setfullfilled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [titleubdated, settitleubdated] = useState({
    id: "",
    title: "",
  });

  const fetchData = async () => {
    try {
      const response = await fetch("/api/productlist");
      const result = await response.json();
      console.log("response", response);
      console.log("result", result);
      if (result.products.length == 0) {
        setLoading(false);
        setfullfilled(true);
      } else if (result.products) {
        setCollections(result.products);
        setLoading(false);
      } else {
        console.error("No products found in response");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCollectionClick = async () => {
    const res = await fetch("/api/editproduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: titleubdated.id,
        title: titleubdated.title,
      }),
    });
    const data = await res.json();
    fetchData();
    settitleubdated({
    id: "",
    title: "",
  });
  };

  const handleDeleteCollection = async (deleteId) => {
    const res = await fetch("/api/editproduct", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: deleteId,
      }),
    });
    const data = await res.json();
    fetchData();
  };

  if (loading) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Spinner accessibilityLabel="Loading user list" size="large" />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  if (fullfilled) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <h2 className="product-title" style={{ color: "red" }}>
              No Product Found
            </h2>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  return (
    <div>
      <div className="product-container">
        <div className="product-top">
          <h2 className="product-title">Our Products</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.productId} className="product-card">
              {product.image && (
                <img src={product.image} className="product-image" />
              )}
              {(product.productId == titleubdated.id ) ?  <div className="product-form-update">
                  <TextField
                    label="Product Title"
                    value={titleubdated.title}
                    onChange={(value) =>
                      settitleubdated({ ...titleubdated, title: value })
                    }
                  />
                  <button onClick={handleCollectionClick} className="update-button update-button-2 ">Update</button>
                </div> :  <> 
                <h3 className="product-name">{product.title}</h3>
                <button
                onClick={() =>
                  settitleubdated({
                    id: product.productId,
                    title: product.title,
                  })
                }
                className="update-button"
              >
                Update
              </button></>}
             
              <button
                onClick={() => handleDeleteCollection(product.productId)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
