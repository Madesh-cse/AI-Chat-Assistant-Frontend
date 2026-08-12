interface Props {
  children: React.ReactNode;
}

export function H1({ children }: Props) {
  return (
    <h1 className="text-4xl font-bold tracking-tight mt-10 mb-6 text-white">
      {children}
    </h1>
  );
}

export function H2({ children }: Props) {
  return (
    <h2 className="text-3xl font-semibold mt-8 mb-5 text-white">
      {children}
    </h2>
  );
}

export function H3({ children }: Props) {
  return (
    <h3 className="text-2xl font-semibold mt-7 mb-4 text-white">
      {children}
    </h3>
  );
}

export function Paragraph({ children }: Props) {
  return (
    <p className="leading-8 text-[16px] mb-6 text-gray-200">
      {children}
    </p>
  );
}