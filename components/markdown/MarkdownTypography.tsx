interface Props {
  children: React.ReactNode;
}

export function H1({ children }: Props) {
  return (
    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-8 mb-3 first:mt-0 text-(--foreground)">
      {children}
    </h1>
  );
}

export function H2({ children }: Props) {
  return (
    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mt-7 mb-3 first:mt-0 text-(--foreground)">
      {children}
    </h2>
  );
}

export function H3({ children }: Props) {
  return (
    <h3 className="text-lg sm:text-xl font-semibold mt-6 mb-2 first:mt-0 text-(--foreground)">
      {children}
    </h3>
  );
}

export function Paragraph({ children }: Props) {
  return (
    <p className="leading-7 text-[15px] sm:text-base mb-4 text-(--markdown-text)">
      {children}
    </p>
  );
}