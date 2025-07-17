require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // секретный ключ Stripe

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "LiveWorks Forward+" },
            unit_amount: 1000, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://liveworks.vercel.app/payments/success-pay.html",
      cancel_url: "https://liveworks.vercel.app/payments/success-pay.html",
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
