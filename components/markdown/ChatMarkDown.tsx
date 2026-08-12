"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import CodeBlock from "../ui/CodeBlock";

import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "./MarkTable";

import {
  H1,
  H2,
  H3,
  Paragraph,
} from "./MarkdownTypography";

import MarkdownLink from "./MarkdownLink";
import MarkdownImage from "./MarkdownImage";

interface Props {
  content: string;
}

export default function ChatMarkdown({
  content,
}: Props) {
  return (
    <div className="chat-markdown w-full min-w-0">

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}

        components={{

          h1: ({ children }) => (
            <H1>{children}</H1>
          ),

          h2: ({ children }) => (
            <H2>{children}</H2>
          ),

          h3: ({ children }) => (
            <H3>{children}</H3>
          ),

          p: ({ children }) => (
            <Paragraph>
              {children}
            </Paragraph>
          ),

          ul: ({ children }) => (
            <ul
              className="
                list-disc
                ml-8
                space-y-2
                my-5
              "
            >
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol
              className="
                list-decimal
                ml-8
                space-y-2
                my-5
              "
            >
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="leading-7">
              {children}
            </li>
          ),

          a: ({ href, children }) => (
            <MarkdownLink href={href}>
              {children}
            </MarkdownLink>
          ),

          blockquote: ({ children }) => (
            <blockquote
              className="
                border-l-4
                border-green-500
                bg-[#2d2d2d]
                rounded-r-xl
                px-5
                py-4
                my-6
                italic
                text-gray-300
              "
            >
              {children}
            </blockquote>
          ),

          hr: () => (
            <hr
              className="
                my-8
                border-[#3a3a3a]
              "
            />
          ),

          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <Table>
                {children}
              </Table>
            </div>
          ),

          thead: ({ children }) => (
            <TableHead>
              {children}
            </TableHead>
          ),

          tbody: ({ children }) => (
            <TableBody>
              {children}
            </TableBody>
          ),

          tr: ({ children }) => (
            <TableRow>
              {children}
            </TableRow>
          ),

          th: ({ children }) => (
            <TableHeader>
              {children}
            </TableHeader>
          ),

          td: ({ children }) => (
            <TableCell>
              {children}
            </TableCell>
          ),

          img: ({ src, alt }) => (
            <MarkdownImage
              src={
                typeof src === "string"
                  ? src
                  : undefined
              }
              alt={
                typeof alt === "string"
                  ? alt
                  : undefined
              }
            />
          ),


          code({
            className,
            children,
            ...props
          }: any) {

            const match =
              /language-(\w+)/.exec(
                className || ""
              );

            const language =
              match?.[1] || "text";

            /*
             * react-markdown gives fenced blocks:
             *
             * ```sql
             * SELECT ...
             * ```
             *
             * className:
             *
             * language-sql
             *
             */

            const isInline =
              !className;

            if (isInline) {
              return (
                <code
                  className="
                    bg-[#1e1e1e]
                    text-green-400
                    rounded-md
                    px-1.5
                    py-0.5
                    text-sm
                    font-mono
                  "
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={language}
              >
                {String(children).replace(
                  /\n$/,
                  ""
                )}
              </CodeBlock>
            );
          },

          pre: ({ children }) => (
            <div className="my-5 w-full overflow-hidden">
              {children}
            </div>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic text-gray-300">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

    </div>
  );
}