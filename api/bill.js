import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { put } from "@vercel/blob";

const fontPath = path.resolve("./fonts/OpenSans-Bold.ttf");
const fontData = fs.readFileSync(fontPath);

// Correct Vercel Serverless Function format (pages/api)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  let body;

  // Parse JSON body (vercel sends req.body as string)
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  let { userName, items, subtotal, tax, total } = body;

  // ---------------------------
  // FIX 1 — Convert items into array
  // ---------------------------

  // If items is a string coming from n8n
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch (err) {
      return res.status(400).json({ error: "Invalid items format" });
    }
  }

  if (!Array.isArray(items)) items = [items];
  if (!items.length) return res.status(400).json({ error: "Items array is empty" });

  // ---------------------------
  // FIX 2 — Normalize item fields
  // ---------------------------
  const normalizedItems = items.map((item) => ({
    name: item.itemName || item.item_name || "Unknown Item",
    qty: Number(item.quantity) || 0,
    price: Number(item.itemPrice || item.price) || 0,
    total: Number(item.total) || (Number(item.quantity) * Number(item.price)),
  }));

  // ---------------------------
  // FIX 3 — Generate SVG (All divs with >1 children must be flex)
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
          // Header
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
              ],
            },
          },

          // Item List
          {
            type: "div",
            props: {
              style: {
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
              },
              children: normalizedItems.map((item) => ({
                type: "p",
                props: {
                  children: `${item.name} — ${item.qty} × ₹${item.price} = ₹${item.total}`,
                },
              })),
            },
          },

          // Totals Section
          {
            type: "div",
            props: {
              style: {
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
              },
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

  // Render PNG
  const png = new Resvg(svg).render().asPng();

  // ---------------------------
  // FIX 4 — Upload PNG to Vercel Blob Storage
  // ---------------------------
  const fileName = `bill-${Date.now()}.png`;

  const upload = await put(fileName, png, {
    access: "public",
    contentType: "image/png",
  });

  // ---------------------------
  // FIX 5 — Return PUBLIC URL as JSON
  // ---------------------------
  return res.status(200).json({
    success: true,
    url: upload.url,
  });
}
