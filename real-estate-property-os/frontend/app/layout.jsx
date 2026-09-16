import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Property OS — real estate CRM & storefront",
  description:
    "Manage listings, site visits, leads, and a public property storefront in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
