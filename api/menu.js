import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { createClient } from "@supabase/supabase-js";

const fontBold = fs.readFileSync(path.resolve("./fonts/OpenSans-Bold.ttf"));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const STYLES = {
  starters: { bg: "#FFF7ED", accent: "#EA580C", grad: ["#F97316", "#EA580C"], icon: "🍴" },
  veg: { bg: "#F0FDF4", accent: "#16A34A", grad: ["#22C55E", "#16A34A"], icon: "🥗" },
  "non-veg": { bg: "#FEF2F2", accent: "#DC2626", grad: ["#EF4444", "#DC2626"], icon: "🍗" },
  beverages: { bg: "#EFF6FF", accent: "#2563EB", grad: ["#3B82F6", "#2563EB"], icon: "🥤" }
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300");

  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Missing category", usage: "/api/menu?category=veg" });
    }

    if (!STYLES[category]) {
      return res.status(400).json({ error: "Invalid category", valid: Object.keys(STYLES) });
    }

    const { data, error } = await supabase
      .from("menu_items")
      .select("name, price, description")
      .eq("category", category)
      .eq("is_available", true)
      .order("name");

    if (error) return res.status(500).json({ error: "Database error" });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No available items", category });
    }

    const s = STYLES[category];

    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            width: 800,
            background: s.bg,
            fontFamily: "Open Sans",
            padding: 20,
            display: "flex",
            flexDirection: "column"
          },
          children: [
            // HEADER FIXED
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: `linear-gradient(90deg, ${s.grad[0]}, ${s.grad[1]})`,
                  padding: "40px 0",
                  color: "white",
                  textAlign: "center"
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: { fontSize: 48, fontWeight: 700 },
                      children: "🍽️ Hotel Paradise"
                    }
                  },
                  {
                    type: "div",
                    props: {
                      style: { fontSize: 32, fontWeight: 700, marginTop: 10 },
                      children: `${s.icon} ${category.toUpperCase()} MENU`
                    }
                  }
                ]
              }
            },

            // MENU ITEMS
            ...data.map((item, index) => ({
              type: "div",
              props: {
                style: {
                  background: "white",
                  marginTop: 25,
                  padding: 20,
                  borderRadius: 14,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", alignItems: "center" },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              width: 50,
                              height: 50,
                              borderRadius: "50%",
                              background: s.accent,
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 24,
                              fontWeight: 700,
                              marginRight: 20
                            },
                            children: String(index + 1)
                          }
                        },
                        {
                          type: "div",
                          props: {
                            style: { display: "flex", flexDirection: "column" },
                            children: [
                              {
                                type: "div",
                                props: {
                                  style: { fontSize: 26, fontWeight: 700, color: "#1F2937" },
                                  children: item.name
                                }
                              },
                              {
                                type: "div",
                                props: {
                                  style: { fontSize: 18, color: "#6B7280", marginTop: 4 },
                                  children: (item.description || "").slice(0, 50)
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        background: s.accent,
                        padding: "12px 24px",
                        borderRadius: 12,
                        color: "white",
                        fontSize: 28,
                        fontWeight: 700
                      },
                      children: `₹${item.price}`
                    }
                  }
                ]
              }
            })),

            // FOOTER FIXED
            {
              type: "div",
              props: {
                style: {
                  marginTop: 40,
                  paddingTop: 20,
                  borderTop: `4px solid ${s.accent}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center"
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: { fontSize: 20, fontWeight: 700, color: "#374151" },
                      children: "To order, reply with:"
                    }
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 26,
                        fontWeight: 700,
                        color: s.accent,
                        marginTop: 8
                      },
                      children: "add: Item Name, Quantity"
                    }
                  }
                ]
              }
            }
          ]
        }
      },

      {
        width: 800,
        height: 240 + data.length * 160,
        fonts: [
          { name: "Open Sans", data: fontBold, weight: 400 },
          { name: "Open Sans", data: fontBold, weight: 700 }
        ]
      }
    );

    const png = new Resvg(svg).render().asPng();

    res.setHeader("Content-Type", "image/png");
    return res.send(png);

  } catch (error) {
    console.error("MENU API ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
