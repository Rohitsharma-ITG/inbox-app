// import { useEffect, useState } from "react";

// export default function CreateSegment() {
//   const [segments, setSegments] = useState([]);

//   const fetchSegments = async () => {
//     try {
//       const res = await fetch("/api/getsegment");
//       const data = await res.json();
//       if (data.segments) {
//         setSegments(data.segments);
//       } else {
//         alert("Failed to fetch segments");
//       }
//     } catch (error) {
//       console.error("Error fetching segments:", error);
//     }
//   };

//   useEffect(() => {
//     fetchSegments();
//   }, []);

//   return (
//     <div>
//       <h3>Existing Segments:</h3>
//       <ul>
//         {segments.map((seg) => (
//           <li key={seg.node.id}>
//             <strong>{seg.node.name}</strong>: {seg.node.query}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Card, Layout, Page, TextContainer, Text, Button } from "@shopify/polaris";

export default function CreateSegment() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const fetchSegments = async () => {
    try {
      const res = await fetch("/api/getsegment");
      const data = await res.json();
      if (data.segments) {
        setSegments(data.segments);
      } else {
        alert("Failed to fetch segments");
      }
    } catch (error) {
      console.error("Error fetching segments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  return (
    <Page title="Existing Segments">
     <div style={{display:"flex",justifyContent:"flex-end",margin:"20px"}}> <Button onClick={() => navigate("/app/addsegment") }>Add Segment</Button></div>
      <Layout>
        <Layout.Section>
          {loading ? (
              <Text>Loading segments...</Text>
          ) : segments.length > 0 ? (
            segments.map((seg) => (
             <div onClick={()=>{
              const updateid = seg.node.id.split("/").pop();
              navigate(`/app/customers/${updateid}`)
             }} style={{cursor:"pointer"}}>
                 <Card key={seg.node.id} sectioned>
                  <Text variant="headingMd">{seg.node.name}</Text>
                  <Text variant="bodyMd" color="subdued">
                    {seg.node.query}
                  </Text>
              </Card>
             </div>
            ))
          ) : (
              <Text>No segments found.</Text>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
