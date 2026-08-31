"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "ta";

const translations = {
  en: {
    // Sidebar
    newChat: "New chat",
    creating: "Creating...",
    searchChats: "Search chats",
    projects: "Projects",
    schedule: "Schedule",
    plugins: "Plugins",
    pinned: "Pinned",
    loadingConversations: "Loading conversations...",
    noConversations: "No conversations yet.",
    today: "Today",
    yesterday: "Yesterday",
    previous7Days: "Previous 7 Days",
    older: "Older",

    // Common
    settings: "Settings",
    closeSidebar: "Close sidebar",
    expandSidebar: "Expand sidebar",
    collapseSidebar: "Collapse sidebar",
    pinConversation: "Pin conversation",
    unpinConversation: "Unpin conversation",
    deleteConversation: "Delete conversation",

    model: "Model",
    localAI: "Local AI",
    share: "Share",
    more: "More",
    logout: "Logout",

    cancel: "Cancel",
    confirm: "Confirm",
    delete: "Delete",
    save: "Save",
    close: "Close",
    language: "Language",

    // Settings sections
    general: "General",
    appearance: "Appearance",
    connectedApps: "Connected Apps",
    notifications: "Notifications",
    personalization: "Personalization",
    dataPrivacy: "Data & Privacy",
    about: "About",

    closeSettings: "Close settings",

    // General
    languageDescription:
      "Choose the language you want to use throughout the application.",
    english: "English",
    tamil: "Tamil",

    enterToSend: "Enter to send",
    enterToSendDescription:
      "Press Enter to send a message. Use Shift + Enter for a new line.",

    streamingResponses: "Streaming responses",
    streamingResponsesDescription:
      "Display AI responses as they are generated.",

    // Appearance
    theme: "Theme",
    themeDescription: "Choose how CacheAI should appear on your device.",
    light: "Light",
    dark: "Dark",
    system: "System",

    accentColor: "Accent color",
    accentColorDescription:
      "Choose an accent color for buttons and interactive elements.",

    // Notifications
    desktopNotifications: "Desktop notifications",
    desktopNotificationsDescription:
      "Receive notifications when an AI response is ready.",

    sound: "Sound",
    soundDescription: "Play a sound when a response is completed.",

    // Personalization
    assistantPersonality: "Assistant personality",
    assistantPersonalityDescription:
      "Choose how you want CacheAI to communicate with you.",

    helpfulConcise: "Helpful & concise",
    helpfulConciseDescription:
      "Clear, direct, and focused responses without unnecessary detail.",

    professional: "Professional",
    professionalDescription:
      "Formal, structured, and professional communication style.",

    friendly: "Friendly",
    friendlyDescription:
      "Warm, approachable, and conversational responses.",

    detailed: "Detailed",
    detailedDescription:
      "Thorough explanations with additional context and examples.",

    technical: "Technical",
    technicalDescription:
      "Precise technical explanations using developer-focused terminology.",

    // Data & Privacy
    chatHistory: "Chat history",
    chatHistoryDescription:
      "Save conversations so you can access them later.",

    improveResponses: "Improve responses",
    improveResponsesDescription:
      "Allow conversations to be used to improve the quality of responses.",

    deleteAllConversations: "Delete all conversations",

    // About
    application: "Application",
    aiChatBot: "CacheAI",

    version: "Version",

    aiModel: "AI Model",
    qwenOllama: "Qwen 2.5 3B · Ollama",
  },

  ta: {
    // Sidebar
    newChat: "புதிய அரட்டை",
    creating: "உருவாக்கப்படுகிறது...",
    searchChats: "அரட்டைகளைத் தேடு",
    projects: "திட்டங்கள்",
    schedule: "அட்டவணை",
    plugins: "செருகுநிரல்கள்",
    pinned: "பின் செய்யப்பட்டவை",
    loadingConversations: "அரட்டைகள் ஏற்றப்படுகின்றன...",
    noConversations: "இதுவரை அரட்டைகள் இல்லை.",
    today: "இன்று",
    yesterday: "நேற்று",
    previous7Days: "முந்தைய 7 நாட்கள்",
    older: "பழையவை",

    // Common
    settings: "அமைப்புகள்",
    closeSidebar: "பக்கப்பட்டியை மூடு",
    expandSidebar: "பக்கப்பட்டியை விரி",
    collapseSidebar: "பக்கப்பட்டியைச் சுருக்கு",
    pinConversation: "அரட்டையைப் பின் செய்",
    unpinConversation: "அரட்டையின் பின்னை அகற்று",
    deleteConversation: "அரட்டையை நீக்கு",

    model: "மாடல்",
    localAI: "உள்ளூர் AI",
    share: "பகிர்",
    more: "மேலும்",
    logout: "வெளியேறு",

    cancel: "ரத்து செய்",
    confirm: "உறுதிப்படுத்து",
    delete: "நீக்கு",
    save: "சேமி",
    close: "மூடு",
    language: "மொழி",

    // Settings sections
    general: "பொது",
    appearance: "தோற்றம்",
    connectedApps: "இணைக்கப்பட்ட பயன்பாடுகள்",
    notifications: "அறிவிப்புகள்",
    personalization: "தனிப்பயனாக்கம்",
    dataPrivacy: "தரவு மற்றும் தனியுரிமை",
    about: "பற்றி",

    closeSettings: "அமைப்புகளை மூடு",

    // General
    languageDescription:
      "பயன்பாடு முழுவதும் நீங்கள் பயன்படுத்த விரும்பும் மொழியைத் தேர்ந்தெடுக்கவும்.",
    english: "ஆங்கிலம்",
    tamil: "தமிழ்",

    enterToSend: "Enter மூலம் அனுப்புதல்",
    enterToSendDescription:
      "செய்தியை அனுப்ப Enter அழுத்தவும். புதிய வரிக்கு Shift + Enter பயன்படுத்தவும்.",

    streamingResponses: "ஸ்ட்ரீமிங் பதில்கள்",
    streamingResponsesDescription:
      "AI பதில் உருவாக்கப்படும் போதே அதை காண்பிக்கவும்.",

    // Appearance
    theme: "தீம்",
    themeDescription:
      "CacheAI உங்கள் சாதனத்தில் எப்படி தோன்ற வேண்டும் என்பதைத் தேர்ந்தெடுக்கவும்.",
    light: "ஒளி",
    dark: "இருள்",
    system: "கணினி",

    accentColor: "முக்கிய நிறம்",
    accentColorDescription:
      "பொத்தான்கள் மற்றும் தொடர்பு கூறுகளுக்கான முக்கிய நிறத்தைத் தேர்ந்தெடுக்கவும்.",

    // Notifications
    desktopNotifications: "டெஸ்க்டாப் அறிவிப்புகள்",
    desktopNotificationsDescription:
      "AI பதில் தயாரானதும் அறிவிப்பைப் பெறவும்.",

    sound: "ஒலி",
    soundDescription:
      "பதில் முடிந்ததும் ஒலி இயக்கவும்.",

    // Personalization
    assistantPersonality: "உதவியாளர் தன்மை",
    assistantPersonalityDescription:
      "CacheAI உங்களுடன் எவ்வாறு தொடர்பு கொள்ள வேண்டும் என்பதைத் தேர்ந்தெடுக்கவும்.",

    helpfulConcise: "உதவிகரமான மற்றும் சுருக்கமான",
    helpfulConciseDescription:
      "தேவையற்ற விவரங்கள் இல்லாமல் தெளிவான மற்றும் நேரடியான பதில்கள்.",

    professional: "தொழில்முறை",
    professionalDescription:
      "முறையான, கட்டமைக்கப்பட்ட மற்றும் தொழில்முறை தொடர்பு முறை.",

    friendly: "நட்பான",
    friendlyDescription:
      "அன்பான, எளிதில் அணுகக்கூடிய மற்றும் உரையாடல் பாணியிலான பதில்கள்.",

    detailed: "விரிவான",
    detailedDescription:
      "கூடுதல் சூழல் மற்றும் எடுத்துக்காட்டுகளுடன் முழுமையான விளக்கங்கள்.",

    technical: "தொழில்நுட்ப",
    technicalDescription:
      "டெவலப்பர்களுக்கான துல்லியமான தொழில்நுட்ப சொற்களுடன் கூடிய விளக்கங்கள்.",

    // Data & Privacy
    chatHistory: "அரட்டை வரலாறு",
    chatHistoryDescription:
      "பின்னர் அணுகுவதற்காக உங்கள் உரையாடல்களைச் சேமிக்கவும்.",

    improveResponses: "பதில்களை மேம்படுத்துதல்",
    improveResponsesDescription:
      "பதில்களின் தரத்தை மேம்படுத்த உரையாடல்களைப் பயன்படுத்த அனுமதிக்கவும்.",

    deleteAllConversations: "அனைத்து உரையாடல்களையும் நீக்கு",

    // About
    application: "பயன்பாடு",
    aiChatBot: "CacheAI",

    version: "பதிப்பு",

    aiModel: "AI மாடல்",
    qwenOllama: "Qwen 2.5 3B · Ollama",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("app-language");

    if (savedLanguage === "en" || savedLanguage === "ta") {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage);
    localStorage.setItem("app-language", nextLanguage);
  }

  function t(key: TranslationKey) {
    return translations[language][key];
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider",
    );
  }

  return context;
}