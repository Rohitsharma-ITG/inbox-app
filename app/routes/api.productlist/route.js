import { json } from "@remix-run/node";
import Rproduct from "../../models/rpoducts.model";

export const loader = async () => {
  try {
    const products = await Rproduct.find();
    return json({ products });
  } catch (error) {
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const action = async ({ request }) => {
  if (request.method === "POST") {
    try {
      const { products } = await request.json();
      if (!Array.isArray(products) || products.length === 0) {
        return json({ error: "Invalid products array" }, { status: 400 });
      }

      const bulkOperations = products.map((product) => ({
        updateOne: {
          filter: { productId: product.id },
          update: {
            productId: product.id,
            title: product.title,
            image: product.image ? product.image : null,
            price: product.price || "0",
          },
          upsert: true,
        },
      }));

      await Rproduct.bulkWrite(bulkOperations);
      return json({ message: "Products added successfully" });
    } catch (error) {
      return json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
};
