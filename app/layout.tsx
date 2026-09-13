import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { SettingsProvider } from "../context/SettingsContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ThemeProvider>
            <SettingsProvider>
              <LanguageProvider>
                {children}
                <Analytics />
                <SpeedInsights />
              </LanguageProvider>
            </SettingsProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}