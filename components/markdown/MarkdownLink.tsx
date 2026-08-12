interface Props {
  href?: string;
  children: React.ReactNode;
}

export default function MarkdownLink({
  href,
  children,
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        text-sky-400
        hover:text-sky-300
        underline
        underline-offset-4
      "
    >
      {children}
    </a>
  );
}