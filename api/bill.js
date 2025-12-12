import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { put } from "@vercel/blob";

const fontPath = path.resolve("./fonts/OpenSans-Bold.ttf");
const fontData = fs.readFileSync(fontPath);

export async function POST(req) {
  let body;

  // Parse JSON
  try {
    body = await req.json();
  } catch (err) {
    return new Response("Invalid JSON", { status: 400 });
  }

  let { userName, items, subtotal, tax, total } = body;

  // Convert items from string if needed
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch (err) {
      return new Response("Invalid items format", { status: 400 });
    }
  }

  if (!Array.isArray(items)) items = [items];
  if (!items.length) return new Response("Items array is empty", { status: 400 });

  // Normalize fields
  const normalizedItems = items.map((item) => ({
    name: item.itemName || item.item_name || "Unknown Item",
    qty: Number(item.quantity) || 0,
    price: Number(item.itemPrice || item.price) || 0,
    total: Number(item.total) || (Number(item.quantity) * Number(item.price)),
  }));

  // Generate SVG
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

          {
            type: "div",
            props: {
              style: { marginTop: "20px" },
              children: normalizedItems.map((item) => ({
                type: "p",
                props: {
                  children: `${item.name} — ${item.qty} × ₹${item.price} = ₹${item.total}`,
                },
              })),
            },
          },

          {
            type: "div",
            props: {
              style: { marginTop: "20px" },
              children: [
                { type: "p", props: { children: `Subtotal: ₹${subtotal}` } },
                { type: "p", props: { children: `GST (5%): ₹${tax}` } },
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

  // Render PNG
  const png = new Resvg(svg).render().asPng();

  // Upload to Vercel Blob Storage
  const fileName = `bill-${Date.now()}.png`;

  const upload = await put(fileName, png, {
    access: "public",
    contentType: "image/png",
  });

  // upload.url → PUBLIC URL FOR TWILIO
  return Response.json({
    success: true,
    url: upload.url,
  });
}
