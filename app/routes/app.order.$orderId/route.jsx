import React, { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useParams } from "@remix-run/react";
import {
  Page,
  Card,
  ResourceList,
  ResourceItem,
  Spinner,
  Text,
  Button,
  Thumbnail,
} from "@shopify/polaris";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/order/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const result = await response.json();
        setOrder(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Page>
        <Spinner accessibilityLabel="Loading order details" size="large" />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Text variant="headingMd" tone="critical">Error: {error}</Text>
      </Page>
    );
  }

  if (!order) {
    return (
      <Page>
        <Text variant="headingMd">No order details available.</Text>
      </Page>
    );
  }

  const { id, name, createdAt, totalPriceSet, customer, lineItems } = order;

  return (
    <Page title={name} subtitle={`Order ID: ${id}`}>
        
      <Card title="Order Summary" sectioned>
        <Text>Order ID: {id}</Text>
        <Text>Order Date: {new Date(createdAt).toLocaleString()}</Text>
        <Text>
          Total Price: {totalPriceSet?.shopMoney?.amount} {totalPriceSet?.shopMoney?.currencyCode}
        </Text>
        <Text>Customer: {customer?.firstName} {customer?.lastName} ({customer?.email})</Text>
       
      </Card>
      <div style={{display:"flex",justifyContent:"flex-end",margin:"20px"}}> <Button primary onClick={() => navigate("/app/ourproducts", { state: id  }) }>Add Product</Button></div>
      <Card title="Ordered Products">
        <ResourceList
          resourceName={{ singular: "product", plural: "products" }}
          items={lineItems?.edges || []}
          renderItem={({ node }) => {
            const media = (
              <Thumbnail
                source={node?.variant?.image?.url || node?.variant?.product?.featuredImage?.url}
                alt={node?.title}
                size="medium"
              />
            );

            return (
              <ResourceItem id={node?.id} media={media}>
                <Text variant="headingMd">{node?.title}</Text>
                <Text>Quantity: {node?.quantity}</Text>
                <Text>Price: {node?.variant?.price} USD</Text>
              </ResourceItem>
            );
          }}
        />
      </Card>
       
    </Page>
  );
};

export default OrderDetails;
