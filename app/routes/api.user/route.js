import { authenticate } from "../../shopify.server";
import { User } from "../../models/user.model";
import { Chat } from "../../models/chats.model";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const shop = session.shop;
    if (!shop) {
      return Response.json({ message: "shop is not found", status: 400 });
    }
    let user = await User.findOne({ email: shop });
    if (!user) {
      return Response.json({ shopEmail: shop });
    }
    if (user) {
      if (user.customer_email) {
        return Response.json({
          message: "customer email is found",
          status: 200,
        });
      } else {
        return Response.json({ shopEmail: shop });
      }
    }
  } catch (error) {
    console.error("Error in loader:", error);
    return Response.json(
      { error: "Failed to fetch shop details" },
      { status: 500 },
    );
  }
};

export const action = async ({ request }) => {
  try {
    if (request.method == "POST") {
      const { customerEmail,role } = await request.json();
     
      if(!customerEmail){
        return Response.json({ message: "email is required", status:400})
      }
      const existUser = await User.findOne({ customer_email: customerEmail })
      if (existUser) {
        return Response.json({ message: "user already exist with this email", status:400})
      }

      const existRole = await User.findOne({ role })
      if (existRole && role == "support") {
        return Response.json({ message: "Support is already exist", status:400})
      }

      const { admin, session } = await authenticate.admin(request);
      const shop = await admin.rest.resources.Shop.all({ session });
      const shopData = shop.data[0];

      let user = await User.findOne({ email: session.shop });

      if (!user) {
        user = new User({
          name: shopData.name,
          email: session.shop,
          customer_email: customerEmail,
          storeid: shopData.id,
          role: role,
        });
        await user.save();

        if (role !== "support") {
          const message = new Chat({
            customerId: user._id,
            messages: {
              sender: "support",
              message: "Hello",
            },
          });
  
          await message.save();
        }
        return Response.json({
          message: "customer email is found",
          status: 200,
        });
      }

      if (user) {
        user.customer_email = customerEmail;
        await user.save();
        return Response.json({
          message: "customer email is found",
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log("error---", error);
    return Response.json(
      { error: "Failed to fetch shop details" },
      { status: 500 },
    );
  }
};
