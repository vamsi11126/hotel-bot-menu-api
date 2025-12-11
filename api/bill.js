import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const fontPath = path.resolve("./fonts/OpenSans-Regular.ttf");
const fontData = fs.readFileSync(fontPath);

export async function POST(req) {
  let body = {};

  try {
    body = await req.json();
  } catch (e) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { userName, items, subtotal, tax, total } = body;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          padding: "30px",
          fontSize: "22px",
          fontFamily: "OpenSans",
        },
        children: [
          {
            type: "h1",
            props: {
              style: { fontSize: "32px", marginBottom: "20px" },
              children: "Hotel Paradise - Bill Receipt",
            },
          },
          {
            type: "p",
            props: {
              children: `Customer: ${userName}`,
            },
          },
          {
            type: "div",
            props: {
              children: items.map((item) => ({
                type: "p",
                props: {
                  children: `${item.item_name} — ${item.quantity} × ₹${item.price} = ₹${item.total}`,
                },
              })),
            },
          },
          {
            type: "p",
            props: { children: `Subtotal: ₹${subtotal}` },
          },
          {
            type: "p",
            props: { children: `GST (5%): ₹${tax}` },
          },
          {
            type: "h2",
            props: { children: `Total: ₹${total}` },
          },
        ],
      },
    },
    {
      width: 800,
      height: 1100,
      fonts: [
        {
          name: "OpenSans",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  const png = new Resvg(svg).render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
