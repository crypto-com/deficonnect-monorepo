// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "DeFi Wallet",
  tagline: "Developer Documentation Center",
  url: "https://crypto-com.github.io",
  baseUrl: "/deficonnect-monorepo",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon-32x32.png",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "crypto-com", // Usually your GitHub org/user name.
  projectName: "deficonnect-monorepo", // Usually your repo name.
  deploymentBranch: "gh-pages",
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
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
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/crypto-com/deficonnect-monorepo/tree/develop/docs",
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/crypto-com/deficonnect-monorepo/tree/develop/docs",
        },
        pages: {
          remarkPlugins: [require("@docusaurus/remark-plugin-npm2yarn")],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  themes: [
    // ... Your other themes.
    [
      "@easyops-cn/docusaurus-search-local",
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        // language: ["en", "zh"],
        // ```
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "DeFi Wallet",
        logo: {
          alt: "Crypto.com Logo",
          src: "img/logo.svg",
        },
        items: [
        //   {
        //     label: "Development",
        //     type: "dropdown",
        //     position: "left",
        //     items: [
        //       //   {
        //       //     type: "doc",
        //       //     docId: "tutorial/intro",
        //       //     label: "Tutorial",
        //       //   },
        //       {
        //         label: "DeFi Wallet",
        //         type: "doc",
        //         docId: "defi-wallet/introduction/welcome",
        //       },
        //       //   {
        //       //     label: "APIs",
        //       //     type: "doc",
        //       //     docId: "accessibilityinfo",
        //       //   },
        //       //   {
        //       //     label: "Architecture",
        //       //     type: "doc",
        //       //     docId: "architecture-overview",
        //       //     docsPluginId: "architecture",
        //       //   },
        //     ],
        //   },
          //   {
          //     type: "doc",
          //     docId: "intro",
          //     position: "left",
          //     label: "Tutorial",
          //   },
          //   { to: "/blog", label: "Blog", position: "left" },
          {
            to: "/docs/category/introduction",
            label: "Introduction",
            position: "left",
          },
          {
            to: "/docs/category/web-sdk",
            label: "Web SDK",
            position: "left",
          },
          {
            to: "/docs/category/integrate-examples",
            label: "Integrate Examples",
            position: "left",
          },
          {
            href: "https://github.com/crypto-com/deficonnect-monorepo",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          //   {
          //     title: "Docs",
          //     items: [
          //       {
          //         label: "Tutorial",
          //         to: "/docs/tutorial/intro",
          //       },
          //     ],
          //   },
          //   {
          //     title: "Community",
          //     items: [
          //       {
          //         label: "Stack Overflow",
          //         href: "https://stackoverflow.com/questions/tagged/docusaurus",
          //       },
          //       {
          //         label: "Discord",
          //         href: "https://discordapp.com/invite/docusaurus",
          //       },
          //       {
          //         label: "Twitter",
          //         href: "https://twitter.com/docusaurus",
          //       },
          //     ],
          //   },
          //   {
          //     title: "More",
          //     items: [
          //   {
          //     label: "Blog",
          //     to: "/blog",
          //   },
          //   {
          //     label: "GitHub",
          //     href: "https://github.com/crypto-com/deficonnect-monorepo",
          //   },
          //     ],
          //   },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Crypto.com, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
