
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Language = "English" | "Tamil" | "Hindi";

interface SettingsContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const SettingsContext = createContext<
  SettingsContextType | undefined
>(undefined);

export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("English");

  const [mounted, setMounted] = useState(false);

  // Load saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "chatbot-language"
    ) as Language | null;

    if (
      savedLanguage === "English" ||
      savedLanguage === "Tamil" ||
      savedLanguage === "Hindi"
    ) {
      setLanguageState(savedLanguage);
    }

    setMounted(true);
  }, []);

  // Save language after initial load
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      "chatbot-language",
      language
    );
  }, [language, mounted]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
}
