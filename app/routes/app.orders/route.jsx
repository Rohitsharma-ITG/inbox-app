// ✅ Polaris styles
import { useEffect,useState } from "react";

import { Page, Card, DataTable, Button, Layout, TextContainer, Text } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";

export default function OrdersPage() {
  const [orders, setorders] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchOrders() {
      const response = await fetch("/api/getorder");
      const data = await response.json();
      setorders(data);
      console.log("rfsdfdfs",data)
    }
    fetchOrders();
  },[]);



  const rows = orders.map((order) => [
    order.node.name,
    order.node.customer.firstName,
    order.node.totalPriceSet.shopMoney.amount,
    order.node.createdAt,
    order.node.displayFulfillmentStatus,
    order.node.lineItems.edges.length ,
    order.node.displayFinancialStatus,
    <Button onClick={() => {
      const updateid = order.node.id.split("/").pop();
      navigate(`/app/order/${updateid}`) }}>View Order</Button>,
  ]);

  return (
    <Page title="Orders">       
      <Layout>
        <Layout.Section>
          <Card>
            <TextContainer>
              <Text variant="headingMd">Shopify Orders</Text>
            </TextContainer>
            <DataTable
              columnContentTypes={["text", "text", "text", "text", "text", "text","text", "numeric"]}
              headings={["Order Name", "Customer", "Total Price", "Date", "Fulfillment","Quantity", "Payment", "Actions"]}
              rows={rows}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
    