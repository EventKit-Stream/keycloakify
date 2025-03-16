import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-measure",
        "@storybook/addon-outline"
        // "@storybook/addon-actions",
        // "@storybook/addon-controls",
        // "@storybook/addon-a11y",
        // "@chromatic-com/storybook",
        // "storybook-dark-mode"
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    staticDirs: ["../public"]
};
export default config;
