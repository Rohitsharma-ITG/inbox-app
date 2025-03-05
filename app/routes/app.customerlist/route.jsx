// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function MessageList() {
//   const [data, setData] = useState([]);
//   const [error, seterror] = useState('')
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("/api/userlist");
//         const result = await response.json();
//         if (result.message == "Access Denied") {
//             seterror('Access Denied')
//         }
//         setData(result.users);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const passId = (userId) => {
//     navigate("/app/chatbox", { state: userId });
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }
  
//   if (error) {
//     return(
//         <h3>{error}</h3>
//     )
//   }

//   return (
//     <div>
//       <h1>Customer List</h1>
//       <ul>
//         {data.map((user) => (
//           <li key={user._id} onClick={() => passId(user._id)}>
//             {user.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Layout, Page, Spinner, Text, ResourceList, ResourceItem, Avatar } from "@shopify/polaris";

export default function MessageList() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/userlist");
        const result = await response.json();
        if (result.message === "Access Denied") {
          setError("Access Denied");
        }
        setData(result.users || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const passId = (userId,name) => { 
    const userinfo = { userId, name };
    navigate("/app/chatbox", { state: userinfo });
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

  if (error) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Text variant="bodyMd" tone="critical">
              {error}
            </Text>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (data.length == 0) {
    <h2>No Customer Found</h2>
  }

  return (
    <Page title="Customer List">
      <Layout>
        <Layout.Section>
          <Card>
            <ResourceList
              resourceName={{ singular: "customer", plural: "customers" }}
              items={data}
              renderItem={(user) => {
                const { _id, name } = user;
                return (
                  <ResourceItem id={_id} onClick={() => passId(_id,name)}>
                    <Avatar customer name={name} /> 
                    <Text variant="bodyMd" fontWeight="bold">
                      {name}
                    </Text>
                  </ResourceItem>
                );
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
