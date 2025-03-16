import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-passkeys-conditional-authenticate.ftl" });

const meta = {
    title: "login/login-passkeys-conditional-authenticate.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory
        kcContext={{
                realm: {
                    registrationAllowed: true,
                    password: true
                },
                registrationDisabled: false,
                usernameHidden: false,
                shouldDisplayAuthenticators: true,
                url: {
                    loginAction: "/mock-login",
                    registrationUrl: "/mock-register"
                    // loginResetCredentialsUrl: "/mock-reset-password"
                },
                authenticators: {
                    authenticators: [
                        {
                            transports: {
                                iconClass: "mfa-email",
                                displayNameProperties: ["email", "phone"]
                            },
                            label: "Email",
                            createdAt: "2023-01-01",
                            credentialId: "credential-id-1",
                        },
                        {
                            transports: {
                                iconClass: "mfa-usb",
                                displayNameProperties: ["USB"]
                            },
                            label: "Security Key",
                            createdAt: "2023-01-01",
                            credentialId: "credential-id-2",
                        }
                    ]
                },
                login: {
                    username: "johndoe"
                },
                messagesPerField: {
                    existsError: (field: string) => field === "username",
                    get: () => "Invalid username"
                }
            }}
    />
};
