import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const fontPath = path.resolve("./fonts/OpenSans-Bold.ttf");
const fontData = fs.readFileSync(fontPath);

export async function POST(req) {
  let body = {};

  try {
    body = await req.json();
  } catch (err) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { userName, items, subtotal, tax, total } = body;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          padding: "40px",
          fontFamily: "OpenSans",
          display: "flex",
          flexDirection: "column",
          width: "800px",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              },
              children: [
                {
                  type: "h1",
                  props: {
                    style: {
                      fontSize: "32px",
                      margin: 0,
                      padding: 0,
                    },
                    children: "Hotel Paradise - Bill Receipt",
                  },
                },
                {
                  type: "p",
                  props: {
                    children: `Customer: ${userName}`,
                    style: { marginTop: "10px" },
                  },
                },
              ],
            },
          },

          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              },
              children: items.map((item) => ({
                type: "p",
                props: {
                  children: `${item.item_name} — ${item.quantity} × ₹${item.price} = ₹${item.total}`,
                },
              })),
            },
          },

          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                marginTop: "20px",
              },
              children: [
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
                  props: {
                    children: `Total: ₹${total}`,
                    style: { marginTop: "10px" },
                  },
                },
              ],
            },
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
