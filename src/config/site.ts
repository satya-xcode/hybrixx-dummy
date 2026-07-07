export const siteConfig = {
  name: "Nomad",
  tagline: "Gear that keeps up with you",
  description:
    "A dummy D2C storefront demo — GaN chargers, cables & everyday carry, built to show off a reusable, animated component system.",
  /**
   * Placeholder domain — this is a demo project (see README). Replace with
   * the real production domain before going live; every metadataBase,
   * canonical URL, sitemap entry, and JSON-LD @id in this project reads
   * from this single value.
   */
  url: "https://nomad-gear.example",
  keywords: [
    "GaN charger",
    "USB-C fast charger",
    "braided USB-C cable",
    "portable power bank",
    "D2C electronics India",
    "travel charging kit",
  ],
  ogImageAlt: "Nomad — Gear that keeps up with you",
  twitterHandle: "@nomad_gear",
  nav: [
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
};

export const contactInfo = {
  email: "hello@nomad-gear.example",
  phone: "+91 98765 43210",
  address: "Sector 62, Noida, Uttar Pradesh, India",
  hours: "Mon–Sat, 10am–6pm IST",
};

export type ProductCategory = "charger" | "cable" | "power-bank" | "kit";

export type Product = {
  id: string;
  slug: string;
  category: ProductCategory;
  name: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  blurb: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    id: "p1",
    category: "charger",
    slug: "65w-gan-charger",
    name: "65W GaN Charger",
    price: 2499,
    compareAtPrice: 3499,
    rating: 4.8,
    reviewCount: 214,
    badge: "Bestseller",
    blurb: "Pocket-sized, laptop-fast. Charges 3 devices at once.",
    description:
      "GaN (gallium nitride) packs more power into less space than the silicon charger you're used to, so this one is smaller than a matchbox but still fast enough for a laptop. Three ports mean your phone, earbuds, and laptop can all top up from a single wall socket.",
    features: [
      "65W total output across 2 USB-C + 1 USB-A port",
      "Charges a 13\" laptop, phone, and earbuds at once",
      "Foldable pins — safe for a bag pocket",
      "Built-in surge & over-heat protection",
    ],
    specs: [
      { label: "Output", value: "65W max (PD 3.0)" },
      { label: "Ports", value: "2× USB-C, 1× USB-A" },
      { label: "Weight", value: "112g" },
      { label: "Warranty", value: "1 year replacement" },
    ],
  },
  {
    id: "p2",
    category: "cable",
    slug: "braided-usb-c-cable",
    name: "Braided USB-C Cable",
    price: 799,
    rating: 4.6,
    reviewCount: 132,
    blurb: "6ft, kevlar-reinforced, survives daily backpack abuse.",
    description:
      "Most cables fray at the connector within months of being crushed in a bag. This one has a kevlar-reinforced core under the braided sleeve, so it bends thousands of times without the copper inside ever knowing.",
    features: [
      "6ft length — reaches from a desk to a couch",
      "Kevlar-reinforced core, rated for 15,000+ bends",
      "100W PD support — cable, not just adapter, matters",
      "Matte braided sleeve, doesn't tangle like rubber cables",
    ],
    specs: [
      { label: "Length", value: "6ft / 1.8m" },
      { label: "Max power", value: "100W (E-marked)" },
      { label: "Data speed", value: "USB 2.0, 480Mbps" },
      { label: "Warranty", value: "1 year replacement" },
    ],
  },
  {
    id: "p3",
    category: "power-bank",
    slug: "10k-power-bank",
    name: "10K Power Bank",
    price: 1999,
    compareAtPrice: 2599,
    rating: 4.7,
    reviewCount: 98,
    badge: "New",
    blurb: "Slim enough for a jacket pocket, still fills a phone twice.",
    description:
      "10,000mAh in a body thin enough to forget it's in your jacket pocket. Pass-through charging means you can top up the bank and your phone overnight from one outlet.",
    features: [
      "10,000mAh — roughly 2 full phone charges",
      "18W fast-charge output",
      "Pass-through charging (charge it + your phone together)",
      "USB-C in and out",
    ],
    specs: [
      { label: "Capacity", value: "10,000mAh" },
      { label: "Output", value: "18W (PD)" },
      { label: "Weight", value: "185g" },
      { label: "Warranty", value: "1 year replacement" },
    ],
  },
  {
    id: "p4",
    category: "kit",
    slug: "4-in-1-travel-kit",
    name: "4-in-1 Travel Kit",
    price: 3299,
    rating: 4.9,
    reviewCount: 61,
    blurb: "Charger, cable, bank, and pouch — one order, zero clutter.",
    description:
      "Everything above, bundled into one zip pouch: the 65W charger, the braided cable, the 10K power bank, and a slim organizer to keep them from tangling in your bag. Built for the person who's tired of buying these one at a time.",
    features: [
      "Includes the 65W GaN Charger + Braided Cable + 10K Power Bank",
      "Slim zip pouch with dedicated cable loop",
      "Saves ~15% versus buying each item separately",
      "One warranty claim covers the whole kit",
    ],
    specs: [
      { label: "Includes", value: "Charger, cable, power bank, pouch" },
      { label: "Pouch size", value: "18 × 10 × 4cm" },
      { label: "Combined weight", value: "~340g" },
      { label: "Warranty", value: "1 year replacement" },
    ],
  },
];

export type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    id: "f1",
    question: "How long does shipping take?",
    answer:
      "Orders placed before 2pm IST ship the same day from our Noida warehouse. Most metros see delivery in 2–3 days, other pin codes in 4–6 days.",
  },
  {
    id: "f2",
    question: "What's covered under the 1-year replacement warranty?",
    answer:
      "Any manufacturing fault — stops charging, port failure, cable fraying at the connector — gets a free replacement within 1 year of purchase. No questions asked, no return shipping charge.",
  },
  {
    id: "f3",
    question: "Will the 65W charger work with my laptop?",
    answer:
      "If your laptop charges over USB-C PD (most MacBooks since 2016, most Windows ultrabooks since 2019), yes. It won't work with older barrel-connector chargers.",
  },
  {
    id: "f4",
    question: "Do you ship outside India?",
    answer:
      "Not yet — this demo storefront currently ships to Indian pin codes only. International shipping is on the roadmap.",
  },
  {
    id: "f5",
    question: "Can I return an item if I change my mind?",
    answer:
      "Yes, unused items in original packaging can be returned within 7 days of delivery for a full refund, no reason needed.",
  },
];

export const aboutStats = [
  { label: "Orders shipped", value: "500+" },
  { label: "Average rating", value: "4.8★" },
  { label: "Warranty", value: "1 year" },
  { label: "Dispatch time", value: "2 days" },
];

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ananya R.",
    role: "Product Designer",
    quote:
      "Charges my laptop and phone off one brick. Haven't touched my old charger since.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Rohan K.",
    role: "Software Engineer",
    quote:
      "The cable survived a full year in my backpack. That alone earned a 5-star review.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Meera S.",
    role: "Travel Blogger",
    quote:
      "Slim, fast, and the packaging alone made it feel like a premium unboxing.",
    rating: 4,
  },
];
