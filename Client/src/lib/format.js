export const CATEGORIES = ["car", "bike", "truck", "suv", "van"];

export const currency = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400">
       <rect width="640" height="400" fill="#171b21"/>
       <text x="50%" y="50%" fill="#3b444f" font-family="sans-serif" font-size="26"
             text-anchor="middle">No image</text>
     </svg>`,
  );
