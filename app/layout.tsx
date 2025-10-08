import AuthProvider from "@/provider/auth.provicer";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./assets/scss/globals.scss";

/* -----------------------------
   ✅ Font Configuration
----------------------------- */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      prefix="og: https://ogp.me/ns#"
      suppressHydrationWarning
      className={poppins.variable}
    >
      <head>
        {/* Progressive Web App (PWA) Setup */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <AuthProvider>
        <body className={poppins.className}>
          {children}

          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
