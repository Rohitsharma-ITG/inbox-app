// import { useEffect, useState } from "react";
// import { useParams } from "@remix-run/react";

// export default function CustomerBySegment() {
//   const [customers, setCustomers] = useState([]);
//  const { segment } = useParams();
 

//   const fetchCustomers = async () => {
//     console.log("segmentId",segment)
//     if (!segment) return;
//     const res = await fetch("/api/getcustomerbysegment", {
//       method: "POST",
//       body: JSON.stringify({ segmentId: segment }),
//       headers: { "Content-Type": "application/json" },
//     });

//     const data = await res.json();
//     if (data.customers) {
//       setCustomers(data.customers);
//     } 
//     if (data.error) {
// console.log(data.error)
//     }
//     else {
//       setCustomers([]);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   return (
//     <div>
//       <h2>Fetch Customers by Segment</h2>

//       <ul>
//         {customers.map((customer) => (
//           <li key={customer.node.id}>
//             {customer.node.firstName} {customer.node.lastName} - {customer.node.email}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams } from "@remix-run/react";
import { Page, Card, Text, Spinner, Layout, ResourceList, Avatar } from "@shopify/polaris";

export default function CustomerBySegment() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { segment } = useParams();

  const fetchCustomers = async () => {
    if (!segment) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/getcustomerbysegment", {
        method: "POST",
        body: JSON.stringify({ segmentId: segment }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.customers) {
        setCustomers(data.customers);
      } else {
        setCustomers([]);
        setError("No customers found in this segment.");
      }
    } catch (err) {
      setError("Failed to fetch customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Page title="Customers by Segment">
      <Layout>
        <Layout.Section>
          <Card>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spinner size="large" />
                <Text variant="bodyMd" color="subdued">
                  Fetching customers...
                </Text>
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Text variant="bodyMd" color="critical">
                  {error}
                </Text>
              </div>
            ) : (
              <ResourceList
                resourceName={{ singular: "customer", plural: "customers" }}
                items={customers}
                renderItem={(customer) => {
                  const { id, firstName, lastName, email } = customer.node;
                  return (
                    <ResourceList.Item
                      id={id}
                      accessibilityLabel={`View details for ${firstName} ${lastName}`}
                      media={<Avatar customer size="medium" name={firstName} />}
                    >
                      <Text variant="bodyMd" fontWeight="bold">
                        {firstName} {lastName}
                      </Text>
                      <Text variant="bodySm" color="subdued">
                        {email}
                      </Text>
                    </ResourceList.Item>
                  );
                }}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
