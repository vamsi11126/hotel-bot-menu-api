import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export async function POST(req) {
  const data = await req.json();

  const svg = await satori(
    {
      type: "div",
      props: {
        style: { padding: "20px", fontSize: "20px" },
        children: [
          {
            type: "h1",
            props: { children: "Hotel Paradise - Bill Receipt" },
          },
          {
            type: "p",
            props: { children: `Customer: ${data.userName}` },
          },
          {
            type: "ul",
            props: {
              children: data.items.map((item) => ({
                type: "li",
                props: {
                  children: `${item.item_name} — ${item.quantity} × ₹${item.price} = ₹${item.total}`,
                },
              })),
            },
          },
          {
            type: "p",
            props: { children: `Subtotal: ₹${data.subtotal}` },
          },
          {
            type: "p",
            props: { children: `GST 5%: ₹${data.tax}` },
          },
          {
            type: "h2",
            props: { children: `Total: ₹${data.total}` },
          },
        ],
      },
    },
    {
      width: 800,
      height: 1000,
      fonts: [],
    }
  );

  const png = new Resvg(svg).render().asPng();

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
}
