import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "./provider";

export const metadata: Metadata = {
  title: "Chat dApp",
  description: "A Decentralized Chat Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
