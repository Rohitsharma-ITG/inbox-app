import { useEffect, useState } from "react";
import { Card, Layout, Page, Spinner, Text, ResourceList, ResourceItem, Avatar } from "@shopify/polaris";
import "./product.css";

export default function Collection() {
  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/getproductshopify");
      const result = await response.json(); 

      if (result.products) { 
        setproducts(result.products);
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

const handleExport = async () => {
  await setLoading(true);
   const res = await fetch("/api/productlist", {
        method: "POST",
        body: JSON.stringify({
          products: products,
        }),
      }); 
    await fetchData();
}


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
  return (
    <div>
      <div className="product-container">
     <div className="product-top">
     <h2 className="product-title">Collections Import</h2>
     <button onClick={()=>handleExport()} className="export-button">Export Products</button>
     </div>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && (
              <img
                src={product.image}
                className="product-image"
              />
            )}
            <h3 className="product-name">{product.title}</h3>
            <h3 className="product-name">RS. {product.price}</h3>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
