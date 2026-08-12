import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

// -----------------------------
// Table Wrapper
// -----------------------------
export function Table({
  children,
}: Props) {
  return (
    <div
      className="
        my-8
        overflow-x-auto
        rounded-xl
        border
        border-[#3a3a3a]
      "
    >
      <table
        className="
          w-full
          border-collapse
          text-sm
        "
      >
        {children}
      </table>
    </div>
  );
}

// -----------------------------
// Table Head
// -----------------------------
export function TableHead({
  children,
}: Props) {
  return (
    <thead
      className="
        bg-[#2d2d2d]
        text-gray-100
      "
    >
      {children}
    </thead>
  );
}

// -----------------------------
// Table Body
// -----------------------------
export function TableBody({
  children,
}: Props) {
  return (
    <tbody className="bg-[#212121]">
      {children}
    </tbody>
  );
}

// -----------------------------
// Table Row
// -----------------------------
export function TableRow({
  children,
}: Props) {
  return (
    <tr
      className="
        border-b
        border-[#3a3a3a]
        hover:bg-[#2a2a2a]
        transition-colors
      "
    >
      {children}
    </tr>
  );
}

// -----------------------------
// Table Header Cell
// -----------------------------
export function TableHeader({
  children,
}: Props) {
  return (
    <th
      className="
        px-5
        py-3
        text-left
        font-semibold
        border
        border-[#3a3a3a]
      "
    >
      {children}
    </th>
  );
}

// -----------------------------
// Table Data Cell
// -----------------------------
export function TableCell({
  children,
}: Props) {
  return (
    <td
      className="
        px-5
        py-3
        border
        border-[#3a3a3a]
        text-gray-300
        align-top
      "
    >
      {children}
    </td>
  );
}