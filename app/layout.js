import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AuthProvider from "./context/authProvider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./polyfills";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SquashUP",
  description: "Track your squash stats",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: "https://squash-up.vercel.app",
    title: "SquashUP",
    description: "Track your squash stats",
    images: [
      {
        url: "/og-image.png",
        width: 512,
        height: 512,
        alt: "SquashUP Preview Image",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        translate="no"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
