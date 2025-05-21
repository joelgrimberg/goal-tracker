// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "goaltracker",
  tagline: "🚨🦄🚨 A unicorny way to track your goals🚨🦄🚨",
  favicon: "img/favicon.ico",
  trailingSlash: true,

  // Set the production url of your site here
  url: "https://joelgrimberg.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/goal-tracker/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "joelgrimberg", // Usually your GitHub org/user name.
  projectName: "goal-tracker", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/joelgrimberg/goal-tracker/tree/main/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: true,
      },
    ],
  ],

  themes: ["@docusaurus/theme-mermaid"],
  markdown: {
    mermaid: true,
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/goaltracker.png",
      navbar: {
        title: "Goaltracker",
        logo: {
          alt: "Goaltracker logo",
          src: "images/square.png",
        },
        items: [
          { type: "localeDropdown", position: "left" },
          {
            href: "https://github.com/joelgrimberg/goal-tracker",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Installation",
                to: "#TODO",
              },
              {
                label: "Configuration",
                to: "#TODO",
              },
            ],
          },
          {
            title: "Community",
            items: [
              // {
              //   label: "Discord",
              //   href: "https://discord.gg/s2zZaXY2JR",
              // },
              {
                label: "GitHub Discussions",
                href: "https://github.com/joelgrimberg/goal-tracker/discussions",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/joelgrimberg/goal-tracker",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Goal-tracker.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["groovy"],
      },
    }),
};

export default config;
