import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "@heroui/link";

export default function LoginPassword(props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { realm, url, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [isPasswordRevealed, toggleIsPasswordRevealed] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("doLogIn")}
            displayMessage={!messagesPerField.existsError("password")}
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    <form
                        id="kc-form-login"
                        onSubmit={() => {
                            setIsLoginButtonDisabled(true);
                            return true;
                        }}
                        action={url.loginAction}
                        method="post"
                        className="flex flex-col gap-4"
                    >
                        <Input
                            label={msg("password")}
                            tabIndex={2}
                            name="password"
                            autoFocus
                            autoComplete="current-password"
                            aria-invalid={messagesPerField.existsError("password")}
                            isInvalid={messagesPerField.existsError("password")}
                            errorMessage={kcSanitize(messagesPerField.get("password"))}
                            aria-live="polite"
                            size="sm"
                            labelPlacement="outside"
                            type={isPasswordRevealed ? "text" : "password"}
                            endContent={
                                <>
                                    <Divider orientation="vertical" className="mr-2"/>
                                    <Button
                                        className="text-lg"
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="primary"
                                        aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                                        aria-controls={"password"}
                                        onPress={() => {
                                            toggleIsPasswordRevealed(!isPasswordRevealed)
                                        }}
                                        aria-hidden
                                    >
                                        {isPasswordRevealed ? <Icon icon="ri:eye-off-line" />: <Icon icon="ri:eye-line" />}
                                    </Button>
                                </>
                            }
                        />
                        <div className="flex flex-col gap-2">
                            {/* <div id="kc-form-options" /> */}
                            <div className="flex justify-end">
                                {realm.resetPasswordAllowed && (
                                    <Link className="text-sm" tabIndex={5} href={url.loginResetCredentialsUrl}>
                                        {msg("doForgotPassword")}
                                    </Link>
                                )}
                            </div>
                        </div>
                        <Button
                            tabIndex={4}
                            isDisabled={isLoginButtonDisabled}
                            name="login"
                            type="submit"
                            value={msgStr("doLogIn")}
                            className="flex items-center justify-center w-full rounded-lg"
                            color="primary"
                        >
                            {msgStr("doLogIn")}
                        </Button>
                    </form>
                </div>
            </div>
        </Template>
    );
}
