import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const fontPath = path.resolve("./fonts/OpenSans-Bold.ttf");
const fontData = fs.readFileSync(fontPath);

export async function POST(req) {
  let body = {};

  // Parse JSON safely
  try {
    body = await req.json();
  } catch (err) {
    return new Response("Invalid JSON", { status: 400 });
  }

  let { userName, items, subtotal, tax, total } = body;

  // ---------------------------
  // FIX 1 — Convert items into an array
  // ---------------------------

  // If items is a string (common when coming from n8n)
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch (err) {
      console.error("Failed JSON.parse for items:", items);
      return new Response("Invalid items format", { status: 400 });
    }
  }

  // If single object → turn into array
  if (!Array.isArray(items)) {
    items = [items];
  }

  // If empty array → invalid
  if (!items.length) {
    return new Response("Items array is empty", { status: 400 });
  }

  // ---------------------------
  // FIX 2 — Normalize item fields
  // ---------------------------
  const normalizedItems = items.map((item) => ({
    name: item.itemName || item.item_name || "Unknown Item",
    qty: Number(item.quantity) || 0,
    price: Number(item.itemPrice || item.price) || 0,
    total: Number(item.total) || (Number(item.price) * Number(item.quantity)),
  }));

  // ---------------------------
  // SVG Generation using Satori
  // ---------------------------

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
            type: "h1",
            props: {
              style: { fontSize: "32px", margin: 0 },
              children: "Hotel Paradise - Bill Receipt",
            },
          },
          {
            type: "p",
            props: {
              style: { marginTop: "10px" },
              children: `Customer: ${userName}`,
            },
          },

          // Items list
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", marginTop: "20px" },
              children: normalizedItems.map((item) => ({
                type: "p",
                props: {
                  children: `${item.name} — ${item.qty} × ₹${item.price} = ₹${item.total}`,
                },
              })),
            },
          },

          // Totals section
          {
            type: "div",
            props: {
              style: { marginTop: "20px" },
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
                    style: { marginTop: "10px" },
                    children: `Total: ₹${total}`,
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
      height: 1000,
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
    headers: { "Content-Type": "image/png" },
  });
}
