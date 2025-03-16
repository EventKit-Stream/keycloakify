import { useScript } from "keycloakify/login/pages/WebauthnRegister.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";

export default function WebauthnRegister(props: PageProps<Extract<KcContext, { pageId: "webauthn-register.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, isSetRetry, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const authButtonId = "authenticateWebAuthnButton";

    useScript({
        authButtonId,
        kcContext,
        i18n
    });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={
                <div className="flex items-center gap-2">
                    <Icon icon="lucide:key-round" />
                    {msg("webauthn-registration-title")}
                </div>
            }
        >
            <form id="register" action={url.loginAction} method="post">
                <div>
                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                    <input type="hidden" id="attestationObject" name="attestationObject" />
                    <input type="hidden" id="publicKeyCredentialId" name="publicKeyCredentialId" />
                    <input type="hidden" id="authenticatorLabel" name="authenticatorLabel" />
                    <input type="hidden" id="transports" name="transports" />
                    <input type="hidden" id="error" name="error" />
                    <Checkbox name="logout-sessions" value="on" defaultSelected size="sm" className="ml-2">
                        <span className="font-normal text-sm">{msg("logoutOtherSessions")}</span>
                    </Checkbox>
                </div>
            </form>
            <div className="flex flex-row gap-2">
                {!isSetRetry && isAppInitiatedAction && (
                    <form action={url.loginAction} className="flex-1" method="post">
                        <Button
                            className="w-full"
                            name="cancel-aia"
                            type="submit"
                            value="true"
                            color="default"
                        >
                            {msg("doCancel")}
                        </Button>
                    </form>
                )}
                <Button
                    className="flex-1"
                    type="submit"
                    value={msgStr("doRegisterSecurityKey")}
                    color="primary"
                    // variant={!isFormSubmittable ? "faded" : "solid"}
                >
                    {msgStr("doRegisterSecurityKey")}
                </Button>
            </div>
        </Template>
    );
}
