"use client";

import { useState } from "react";
import { X, Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ConnectedApps from "./ConnectedApps";
import { useSettings, Language } from "../../context/SettingsContext";

interface SettingsModalProps {
  onClose: () => void;
}

type Accent = "blue" | "purple" | "green" | "orange";

type Personality =
  | "Helpful & concise"
  | "Professional"
  | "Friendly"
  | "Detailed"
  | "Technical";

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState("General");
  const [accent, setAccent] = useState<Accent>("blue");
  const [personality, setPersonality] =
    useState<Personality>("Helpful & concise");

  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useSettings();

  const sections = [
    "General",
    "Appearance",
    "Connected Apps",
    "Notifications",
    "Personalization",
    "Data & Privacy",
    "About",
  ];

  return (
    <div
      className="
        fixed
        inset-0
        z-100
        flex
        items-center
        justify-center
        bg-black/60
        backdrop-blur-sm
        sm:p-4
      "
    >
      <div
        className="
          flex
          flex-col
          lg:flex-row
          h-full
          w-full
          lg:h-[min(37.5rem,85vh)]
          lg:w-[min(56.25rem,90vw)]
          overflow-hidden
          lg:rounded-2xl
          border-0
          lg:border
          border-(--border)
          bg-(--background)
          text-(--foreground)
          shadow-2xl
        "
      >
        <div
          className="
            w-full
            lg:w-60
            shrink-0
            border-b
            lg:border-b-0
            lg:border-r
            border-(--border)
            bg-(--sidebar)
            p-3
            lg:p-4
          "
        >
          <div
            className="
              mb-6
              hidden
              lg:flex
              items-center
              justify-between
              px-2
            "
          >
            <h2 className="text-lg font-semibold">Settings</h2>

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-lg
                p-2
                text-(--muted)
                transition
                hover:bg-(--hover)
                hover:text-(--foreground)
              "
              aria-label="Close settings"
            >
              <X size={18} />
            </button>
          </div>
          <div
            className="
              flex
              lg:block
              gap-2
              lg:space-y-1
              overflow-x-auto
              lg:overflow-visible
              scrollbar-none
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {sections.map((section) => (
              <button
                type="button"
                key={section}
                onClick={() => setActiveSection(section)}
                className={`
                  shrink-0
                  lg:w-full
                  whitespace-nowrap
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  transition

                  ${
                    activeSection === section
                      ? "bg-(--active) text-(--foreground)"
                      : "text-(--muted) hover:bg-(--hover) hover:text-(--foreground)"
                  }
                `}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div
            className="
              sticky
              top-0
              z-10
              flex
              items-center
              justify-between
              border-b
              border-(--border)
              bg-(--background)
              px-4
              sm:px-8
              py-4
              sm:py-5
            "
          >
            <h3 className="text-lg sm:text-xl font-semibold">
              {activeSection}
            </h3>

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-lg
                p-2
                text-(--muted)
                transition
                hover:bg-(--hover)
                hover:text-(--foreground)
              "
              aria-label="Close settings"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 sm:p-8">
            {activeSection === "General" && (
              <div className="space-y-6">
                <SettingRow
                  title="Language"
                  description="Choose the language used by the assistant."
                >
                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value as Language)
                    }
                    className="
          min-w-32
          cursor-pointer
          rounded-lg
          border
          border-(--border)
          bg-(--input-bg)
          px-3
          py-2
          text-sm
          text-(--foreground)
          outline-none
          transition
          hover:border-(--border-hover)
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
        "
                  >
                    <option value="en">English</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </SettingRow>

                <SettingRow
                  title="Enter to send"
                  description="Press Enter to send a message."
                >
                  <Toggle defaultChecked />
                </SettingRow>

                <SettingRow
                  title="Streaming responses"
                  description="Show responses as they are generated."
                >
                  <Toggle defaultChecked />
                </SettingRow>
              </div>
            )}
            {activeSection === "Appearance" && (
              <div className="space-y-8">
                {/* Theme */}

                <div>
                  <h4 className="mb-2 font-medium">Theme</h4>

                  <p className="mb-4 text-sm text-(--muted)">
                    Choose how AI Chat Bot looks.
                  </p>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <ThemeButton
                      icon={<Sun size={20} />}
                      label="Light"
                      active={theme === "light"}
                      onClick={() => setTheme("light")}
                    />

                    <ThemeButton
                      icon={<Moon size={20} />}
                      label="Dark"
                      active={theme === "dark"}
                      onClick={() => setTheme("dark")}
                    />

                    <ThemeButton
                      icon={<Monitor size={20} />}
                      label="System"
                      active={theme === "system"}
                      onClick={() => setTheme("system")}
                    />
                  </div>
                </div>

                {/* Accent Color */}

                <div>
                  <h4 className="mb-2 font-medium">Accent color</h4>

                  <p className="mb-4 text-sm text-(--muted)">
                    Choose the primary color for the interface.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {(["blue", "purple", "green", "orange"] as Accent[]).map(
                      (color) => (
                        <button
                          type="button"
                          key={color}
                          onClick={() => setAccent(color)}
                          aria-label={`${color} accent`}
                          className={`
                          relative
                          h-10
                          w-10
                          rounded-full
                          border-2
                          transition
                          hover:scale-105

                          ${
                            accent === color
                              ? "border-(--foreground)"
                              : "border-transparent"
                          }

                          ${
                            color === "blue"
                              ? "bg-blue-500"
                              : color === "purple"
                                ? "bg-purple-500"
                                : color === "green"
                                  ? "bg-green-500"
                                  : "bg-orange-500"
                          }
                        `}
                        >
                          {accent === color && (
                            <Check
                              size={18}
                              className="
                              absolute
                              inset-0
                              m-auto
                              text-white
                            "
                            />
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Connected Apps" && <ConnectedApps />}
            {activeSection === "Notifications" && (
              <div className="space-y-6">
                <SettingRow
                  title="Desktop notifications"
                  description="Receive notifications for important events."
                >
                  <Toggle />
                </SettingRow>

                <SettingRow
                  title="Sound"
                  description="Play a sound when a response is completed."
                >
                  <Toggle defaultChecked />
                </SettingRow>
              </div>
            )}

            {activeSection === "Personalization" && (
              <div className="space-y-8">
                <div>
                  <h4 className="font-medium text-(--foreground)">
                    Assistant personality
                  </h4>

                  <p className="mt-1 text-sm text-(--muted)">
                    Choose how the assistant communicates with you.
                  </p>

                  <div className="mt-5 space-y-2">
                    {[
                      {
                        value: "Helpful & concise" as Personality,
                        title: "Helpful & concise",
                        description:
                          "Clear, direct answers without unnecessary detail.",
                      },
                      {
                        value: "Professional" as Personality,
                        title: "Professional",
                        description:
                          "Polished, structured, and suitable for work and business.",
                      },
                      {
                        value: "Friendly" as Personality,
                        title: "Friendly",
                        description: "Warm, conversational, and approachable.",
                      },
                      {
                        value: "Detailed" as Personality,
                        title: "Detailed",
                        description:
                          "Thorough explanations with useful context and examples.",
                      },
                      {
                        value: "Technical" as Personality,
                        title: "Technical",
                        description:
                          "Precise, developer-focused answers with technical depth.",
                      },
                    ].map((option) => {
                      const selected = personality === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPersonality(option.value)}
                          className={`
                            group
                            flex
                            w-full
                            items-center
                            justify-between
                            gap-4
                            rounded-xl
                            border
                            px-4
                            py-3.5
                            text-left
                            transition-all
                            duration-150

                            ${
                              selected
                                ? "border-blue-500/60 bg-blue-500/10"
                                : "border-(--border) bg-(--card) hover:bg-(--hover) hover:border-(--border-hover)"
                            }
                          `}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-(--foreground)">
                              {option.title}
                            </p>

                            <p className="mt-1 text-sm leading-5 text-(--muted)">
                              {option.description}
                            </p>
                          </div>

                          {/* Radio */}

                          <div
                            className={`
                              flex
                              h-5
                              w-5
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              transition

                              ${
                                selected
                                  ? "border-blue-500"
                                  : "border-(--border) group-hover:border-(--muted)"
                              }
                            `}
                          >
                            {selected && (
                              <div
                                className="
                                  h-2.5
                                  w-2.5
                                  rounded-full
                                  bg-blue-500
                                "
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Data & Privacy" && (
              <div className="space-y-6">
                <SettingRow
                  title="Chat history"
                  description="Save conversations to your database."
                >
                  <Toggle defaultChecked />
                </SettingRow>

                <SettingRow
                  title="Improve responses"
                  description="Allow conversations to be used for improving your assistant."
                >
                  <Toggle />
                </SettingRow>

                <button
                  type="button"
                  className="
                    rounded-lg
                    border
                    border-red-500/30
                    px-4
                    py-2
                    text-sm
                    text-red-400
                    transition
                    hover:bg-red-500/10
                  "
                >
                  Delete all conversations
                </button>
              </div>
            )}

            {activeSection === "About" && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-(--muted)">Application</p>

                  <p className="mt-1">AI Chat Bot</p>
                </div>

                <div>
                  <p className="text-sm text-(--muted)">Version</p>

                  <p className="mt-1">1.0.0</p>
                </div>

                <div>
                  <p className="text-sm text-(--muted)">AI Model</p>

                  <p className="mt-1">Qwen 2.5 3B via Ollama</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        justify-between
        gap-3
        sm:gap-0
        border-b
        border-(--border)
        pb-5
      "
    >
      <div className="sm:pr-8">
        <h4 className="text-sm font-medium">{title}</h4>

        <p className="mt-1 text-sm text-(--muted)">{description}</p>
      </div>

      {children}
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <button
      type="button"
      onClick={() => setEnabled((previous) => !previous)}
      aria-pressed={enabled}
      className={`
        relative
        h-6
        w-11
        shrink-0
        rounded-full
        transition
        ${enabled ? "bg-blue-500" : "bg-(--toggle-off)"}
      `}
    >
      <span
        className={`
          absolute
          top-1
          h-4
          w-4
          rounded-full
          bg-white
          shadow-sm
          transition
          ${enabled ? "left-6" : "left-1"}
        `}
      />
    </button>
  );
}

function ThemeButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        flex-col
        items-center
        gap-2
        rounded-xl
        border
        p-3
        sm:p-4
        transition

        ${
          active
            ? "border-blue-500 bg-blue-500/10 text-blue-500"
            : "border-(--border) bg-(--card) text-(--foreground) hover:bg-(--hover)"
        }
      `}
    >
      {icon}

      <span className="text-sm">{label}</span>
    </button>
  );
}
