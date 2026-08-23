import { Navbar } from "@/components/shared/Navbar";
import Providers from "./providers";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
          <Providers>{children}</Providers>
      </body>
    </html>
  );
}