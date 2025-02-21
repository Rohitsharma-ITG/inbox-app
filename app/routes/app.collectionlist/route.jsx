import { useEffect, useState } from "react";
import { Card, Layout, Page, Spinner, Text, ResourceList, ResourceItem, Avatar } from "@shopify/polaris";
import "./collection.css";

export default function CollectionList() {
  const [collections, setCollections] = useState([]);
  const [fullfilled, setfullfilled] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/collectionlist");
      const result = await response.json(); 
      console.log("response",response)
      console.log("result",result)
       if (result.collections.length == 0) {
        setLoading(false);
        setfullfilled(true);
      } else if (result.collections) { 
        setCollections(result.collections);
        setLoading(false);
      }
       else {
        console.error("No collections found in response");
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


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
            <h2 className="collection-title" style={{color:"red"}}>No Collection Found</h2>
            </Layout.Section>
        </Layout>
        </Page>
    );
}
  return (
    <div>
      <div className="collection-container">
     <div className="collection-top">
     <h2 className="collection-title">Our Collections</h2>
     </div>
      <div className="collection-grid">
        {collections.map((collection) => (
          <div key={collection.collectionId} className="collection-card">
            {collection.image && (
              <img
                src={collection.image}
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
