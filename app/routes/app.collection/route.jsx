import { useEffect, useState } from "react";
import { Card, Layout, Page, Spinner, Text, ResourceList, ResourceItem, Avatar } from "@shopify/polaris";
import "./collection.css";

export default function Collection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/getcollectionshopify");
      const result = await response.json(); 

      if (result.collection) { 
        setCollections(result.collection);
        setLoading(false);
      } else {
        console.error("No collections found in response");
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

const handleExport = async () => {
  await setLoading(true);
   const res = await fetch("/api/collectionlist", {
        method: "POST",
        body: JSON.stringify({
          collections: collections,
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
      <div className="collection-container">
     <div className="collection-top">
     <h2 className="collection-title">Collections Import</h2>
     <button onClick={()=>handleExport()} className="export-button">Export Collections</button>
     </div>
      <div className="collection-grid">
        {collections.map((collection) => (
          <div key={collection.id} className="collection-card">
            {collection.image && (
              <img
                src={collection.image.url}
                alt={collection.image.altText}
                className="collection-image"
              />
            )}
            <h3 className="collection-name">{collection.title}</h3>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
