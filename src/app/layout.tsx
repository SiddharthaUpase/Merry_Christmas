import { Playfair_Display } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '900'],
});

export const metadata: Metadata = {
  title: "Christmas Wishes",
  description: "Create and share your personalized Christmas wishes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={playfair.className}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
