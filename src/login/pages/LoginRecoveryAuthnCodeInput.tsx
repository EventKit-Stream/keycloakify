import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

export default function LoginRecoveryAuthnCodeInput(props: PageProps<Extract<KcContext, { pageId: "login-recovery-authn-code-input.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, messagesPerField, recoveryAuthnCodesInputBean } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("auth-recovery-code-header")}
            displayMessage={!messagesPerField.existsError("recoveryCodeInput")}
        >
            <form id="kc-recovery-code-login-form" className="flex flex-col gap-4" action={url.loginAction} method="post">
                <Input
                    label= {msg("auth-recovery-code-prompt", `${recoveryAuthnCodesInputBean.codeNumber}`)}
                    tabIndex={1}
                    name="recoveryCodeInput"
                    aria-invalid={messagesPerField.existsError("recoveryCodeInput")}
                    autoComplete="off"
                    type="text"
                    autoFocus
                    isInvalid={messagesPerField.existsError("recoveryCodeInput")}
                    errorMessage={kcSanitize(messagesPerField.get("recoveryCodeInput"))}
                    size="sm"
                    labelPlacement="outside"
                    aria-live="polite"
                />
                <Button
                    name="login"
                    type="submit"
                    value={msgStr("doLogIn")}
                    className="flex items-center justify-center w-full rounded-lg"
                    color="primary"
                >
                    {msgStr("doLogIn")}
                </Button>
            </form>
        </Template>
    );
}
