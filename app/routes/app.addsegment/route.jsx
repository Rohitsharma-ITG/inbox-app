// import { useState } from "react";
// import { Card, Page, TextField, Button, FormLayout, Layout, Toast, Frame } from "@shopify/polaris";

// export default function CreateSegment() {
//   const [segment, setSegment] = useState({ name: "", query: "" });
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState({ active: false, message: "", error: false });

//   const createSegment = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/addsegment", {
//         method: "POST",
//         body: JSON.stringify(segment),
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = await res.json();
//       if (data.segment) {
//         setToast({ active: true, message: "Segment created successfully!", error: false });
//         setSegment({ name: "", query: "" }); // Reset form after success
//       } else {
//         setToast({ active: true, message: `Error: ${data.error}`, error: true });
//       }
//     } catch (error) {
//       console.error("Error creating segment:", error);
//       setToast({ active: true, message: "Failed to create segment. Please try again.", error: true });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     createSegment();
//   };

//   return (
//     <Frame>
//       {toast.active && (
//         <Toast content={toast.message} error={toast.error} onDismiss={() => setToast({ ...toast, active: false })} />
//       )}
//       <Page title="Create a Segment">
//         <Layout>
//           <Layout.Section>
//             <Card sectioned>
//               <form onSubmit={handleSubmit}>
//                 <FormLayout>
//                   <TextField
//                     label="Segment Name"
//                     value={segment.name}
//                     onChange={(value) => setSegment({ ...segment, name: value })}
//                     autoComplete="off"
//                     required
//                   />
//                   <TextField
//                     label="Segment Query"
//                     value={segment.query}
//                     onChange={(value) => setSegment({ ...segment, query: value })}
//                     placeholder="e.g. customer_tags CONTAINS 'VIP'"
//                     autoComplete="off"
//                   />
//                   <Button primary loading={loading} submit>
//                     Create Segment
//                   </Button>
//                 </FormLayout>
//               </form>
//             </Card>
//           </Layout.Section>
//         </Layout>
//       </Page>
//     </Frame>
//   );
// }


import { useState } from "react";
import {
  Card,
  Page,
  TextField,
  Button,
  FormLayout,
  Layout,
  Toast,
  Frame,
  Select,
} from "@shopify/polaris";

export default function CreateSegment() {
  const [segment, setSegment] = useState({
    field: "customer_tags", // Default selection
    operator: "contains", // Default selection
    value: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ active: false, message: "", error: false });

  const queryFields = [
    { label: "Customer Tags", value: "customer_tags" },
    { label: "number_of_orders", value: "number_of_orders" },
    { label: "customer_regions", value: "customer_regions" },
    { label: "amount_spent", value: "amount_spent" },
    { label: "last_order_date", value: "last_order_date" },
    { label: "first_order_date", value: "first_order_date" },
  ];

  const operators = [
    { label: "Contains", value: "CONTAINS" },
    { label: "Equals (==)", value: "=" },
    { label: "NOT Equals (!=)", value: "!=" },
    { label: "Smaller or equal to (<=)", value: "<=" },
    { label: "Greater or equal to (>=)", value: ">=" },
    { label: "BETWEEN", value: "BETWEEN" },
    { label: "IS NULL", value: "IS NULL" },
    { label: "IS NOT NULL", value: "IS NOT NULL" },
    { label: "NOT CONTAINS", value: "NOT CONTAINS" },
    { label: "Greater Than (>)", value: ">" },
    { label: "Less Than (<)", value: "<" },
  ];

  const createSegment = async () => {
    try {
      setLoading(true);
      let query;
      const formatValue = (value) => {
        return isNaN(value) ? `'${value}'` : value; 
      };
      if (segment.value) {
         query = `${segment.field} ${segment.operator} ${formatValue(segment.value)}`;
      } else {
         query = `${segment.field} ${segment.operator}`;
      }
      
      const res = await fetch("/api/addsegment", {
        method: "POST",
        body: JSON.stringify({ name: segment.name, query }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        setToast({ active: true, message: "Segment created successfully!", error: false });
        setSegment({ field: "customer_tags", operator: "contains", value: "", name: "" }); // Reset form
      } else {
        setToast({ active: true, message: `Error: ${data.error}`, error: true });
      }
    } catch (error) {
      console.error("Error creating segment:", error);
      setToast({ active: true, message: "Failed to create segment. Please try again.", error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createSegment();
  };

  return (
    <Frame>
      {toast.active && (
        <Toast content={toast.message} error={toast.error} onDismiss={() => setToast({ ...toast, active: false })} />
      )}
      <Page title="Create a Segment">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <form onSubmit={handleSubmit}>
                <FormLayout>
                  <TextField
                    label="Segment Name"
                    value={segment.name}
                    onChange={(value) => setSegment({ ...segment, name: value })}
                    autoComplete="off"
                    required
                  />

                  <Select
                    label="Select Field"
                    options={queryFields}
                    value={segment.field}
                    onChange={(value) => setSegment({ ...segment, field: value })}
                  />

                  <Select
                    label="Select Operator"
                    options={operators}
                    value={segment.operator}
                    onChange={(value) => setSegment({ ...segment, operator: value })}
                  />

                  <TextField
                    label="Enter Value"
                    value={segment.value}
                    onChange={(value) => setSegment({ ...segment, value })}
                    placeholder="e.g. VIP, 100, 5000"
                    autoComplete="off"
                    required
                  />

                  <Button primary loading={loading} submit>
                    Create Segment
                  </Button>
                </FormLayout>
              </form>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}
