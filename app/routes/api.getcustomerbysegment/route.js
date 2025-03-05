// import { json } from "@remix-run/node";
// import { authenticate } from "../../shopify.server";

// export const action = async ({ request }) => {
//   try {
//     const { admin } = await authenticate.admin(request);

//     if (request.method !== "POST") {
//       return json({ error: "Only POST requests are allowed" }, { status: 405 });
//     }

//     const { segmentId } = await request.json();
//     // console.log('segmentIDd',segmentId);
//     if (!segmentId) {
//       return json({ error: "Segment ID is required!" }, { status: 400 });
//     }

//     const query = `#graphql
//         mutation {
//   customerSegmentMembersQueryCreate(input: { segmentId: "gid://shopify/Segment/1083725545495"}) {
//     customerSegmentMembersQuery {
//       id
//     }
//     userErrors {
//       field
//       message
//     }
//   }
// }
//   `;

//     const response = await admin.graphql(query);
//     const data = await response.json();
//     const queryId = data.data.customerSegmentMembersQueryCreate.customerSegmentMembersQuery.id

//    console.log('queryID',queryId);

//     const query2 = `#graphql
//        query {
//   customerSegmentMembersQuery(id: '${queryId}') {
//     members {
//       edges {
//         node {
//           id
//           firstName
//           lastName
//           email
//         }
//       }
//     }
//   }
// }
//   `;

//     const response2 = await admin.graphql(query2);
//     const data2 = await response2.json();
//     console.log("ressee2", data2);

//     if (
//       !response.segmentMembers ||
//       response.segmentMembers.edges.length === 0
//     ) {
//       return json(
//         { error: "No customers found for this segment" },
//         { status: 404 },
//       );
//     }

//     return json({
//       customers: response.segmentMembers.edges.map((c) => c.node),
//     });
//   } catch (error) {
//     console.error("Error fetching customers by segment:", error);
//     return json({ error: "Internal Server Error" }, { status: 500 });
//   }
// };
import { json } from "@remix-run/node";
import { authenticate } from "../../shopify.server";

export const action = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    if (request.method !== "POST") {
      return json({ error: "Only POST requests are allowed" }, { status: 405 });
    }

    const { segmentId } = await request.json();
    if (!segmentId) {
      return json({ error: "Segment ID is required!" }, { status: 400 });
    }

    const mutation = `#graphql
      query {
  segment(id: "gid://shopify/Segment/${segmentId}") {
    id
    name
    query
  }
}
    `;

    let createResponse = await admin.graphql(mutation);
    createResponse = await createResponse.json();
    const query2 = createResponse.data.segment.query;
    console.log("rect", createResponse.data.segment.query);
    console.log("query2", query2);
    const fetchQuery = `#graphql
      query {
  customerSegmentMembers(first: 100, query: "${query2}") {
    totalCount
    statistics {
      attributeStatistics(attributeName: "amount_spent") {
        average
      }
    }
    edges {
      node {
        id
        firstName
        lastName
        defaultEmailAddress {
          emailAddress
        }
      }
    }
  }
}
    `;

    let fetchResponse = await admin.graphql(fetchQuery);
    fetchResponse = await fetchResponse.json();
    const customers = fetchResponse.data.customerSegmentMembers.edges
    if (customers.length === 0) {
      return json(
        { error: "No customers found for this segment" },
        { status: 404 },
      );
    }

    return json({ customers });
  } catch (error) {
    console.error("Error fetching customers by segment:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
