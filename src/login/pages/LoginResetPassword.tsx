import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, realm, auth, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            displayMessage={!messagesPerField.existsError("username")}
            infoNode={realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
            headerNode={msg("emailForgotTitle")}
        >
            <form id="kc-reset-password-form" className="flex flex-col gap-4" action={url.loginAction} method="post">
                <Input
                    label={!realm.loginWithEmailAllowed
                            ? msg("username")
                            : !realm.registrationEmailAsUsername
                                ? msg("usernameOrEmail")
                                : msg("email")}
                    name="username"
                    defaultValue={auth.attemptedUsername ?? ""}
                    autoFocus
                    aria-invalid={messagesPerField.existsError("username")}
                    isInvalid={messagesPerField.existsError("username")}
                    errorMessage={kcSanitize(messagesPerField.get("username"))}
                    size="sm"
                    labelPlacement="outside"
                    aria-live="polite"
                />

                <div className="flex flex-col gap-2">
                    <Link href={url.loginUrl}>{msg("backToLogin")}</Link>
                    <Button
                        value={msgStr("doSubmit")}
                        type="submit"
                        color="primary"
                    >
                        {msgStr("doSubmit")}
                    </Button>
                </div>
            </form>
        </Template>
    );
}
