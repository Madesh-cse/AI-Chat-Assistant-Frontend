import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { SettingsProvider } from "../context/SettingsContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Providers from "./providers";

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
              </LanguageProvider>
            </SettingsProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}