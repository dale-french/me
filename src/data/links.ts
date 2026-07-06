export interface ContactLink {
  readonly label: string;
  readonly href: string;
  /** Plain-text value to expose for clipboard copy (e.g. an email address). */
  readonly copy?: string;
  /** Open in a new tab. Defaults to false; internal links never set this. */
  readonly external?: boolean;
}

export const contactLinks: readonly ContactLink[] = [
  {
    label: "Email",
    href: "mailto:hello@dalefrench.dev",
    copy: "hello@dalefrench.dev",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/dale-french",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dale-french-dev/",
    external: true,
  },
];
