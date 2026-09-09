import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Table({ children }: Props) {
  return (
    <div
      className="
        my-8
        overflow-x-auto
        rounded-xl
        border
        border-(--border)
        bg-(--card)
        transition-colors
        duration-200
      "
    >
      <table
        className="
          w-full
          border-collapse
          text-sm
          text-(--foreground)
        "
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: Props) {
  return (
    <thead
      className="
        bg-(--input-bg)
        text-(--foreground)
        transition-colors
        duration-200
      "
    >
      {children}
    </thead>
  );
}

export function TableBody({ children }: Props) {
  return (
    <tbody
      className="
        bg-(--card)
        text-(--foreground)
        transition-colors
        duration-200
      "
    >
      {children}
    </tbody>
  );
}

export function TableRow({ children }: Props) {
  return (
    <tr
      className="
        border-b
        border-(--border)
        transition-colors
        duration-200
        hover:bg-(--hover)
      "
    >
      {children}
    </tr>
  );
}

export function TableHeader({ children }: Props) {
  return (
    <th
      className="
        border
        border-(--border)
        px-5
        py-3
        text-left
        font-semibold
        text-(--foreground)
        transition-colors
        duration-200
      "
    >
      {children}
    </th>
  );
}

export function TableCell({ children }: Props) {
  return (
    <td
      className="
        border
        border-(--border)
        px-5
        py-3
        align-top
        text-(--muted)
        transition-colors
        duration-200
      "
    >
      {children}
    </td>
  );
}