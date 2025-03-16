import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox } from "@heroui/checkbox";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg, msgStr } = i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;
    const [isPasswordRevealed, toggleIsPasswordRevealed] = useState(false);
    const [isConfirmPasswordRevealed, toggleIsConfirmPasswordRevealed] = useState(false);


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
            headerNode={msg("updatePasswordTitle")}
        >
            <form id="kc-passwd-update-form" className="flex flex-col gap-4" action={url.loginAction} method="post">
                <div>
                    <Input
                        label={msg("passwordNew")}
                        name="password-new"
                        autoFocus
                        autoComplete="new-password"
                        aria-invalid={messagesPerField.existsError("password", "password-confirm")}
                        isInvalid={messagesPerField.existsError("password", "password-confirm")}
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
                                >
                                    {isPasswordRevealed ? <Icon icon="ri:eye-off-line" />: <Icon icon="ri:eye-line" />}
                                </Button>
                            </>
                        }
                    />
                    <Input
                        label={msg("passwordConfirm")}
                        name="password-confirm"
                        autoFocus
                        autoComplete="new-password"
                        aria-invalid={messagesPerField.existsError("password", "password-confirm")}
                        isInvalid={messagesPerField.existsError("password", "password-confirm")}
                        errorMessage={kcSanitize(messagesPerField.get("password-confirm"))}
                        aria-live="polite"
                        size="sm"
                        labelPlacement="outside"
                        type={isConfirmPasswordRevealed ? "text" : "password"}
                        endContent={
                            <>
                                <Divider orientation="vertical" className="mr-2"/>
                                <Button
                                    className="text-lg"
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    color="primary"
                                    aria-label={msgStr(isConfirmPasswordRevealed ? "hidePassword" : "showPassword")}
                                    aria-controls={"password"}
                                    onPress={() => {
                                        toggleIsConfirmPasswordRevealed(!isConfirmPasswordRevealed)
                                    }}
                                >
                                    {isConfirmPasswordRevealed ? <Icon icon="ri:eye-off-line" />: <Icon icon="ri:eye-line" />}
                                </Button>
                            </>
                        }
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Checkbox name="logout-sessions" value="on" defaultSelected size="sm" className="ml-2">
                        <span className="font-normal text-xs text-gray-500">{msg("logoutOtherSessions")}</span>
                    </Checkbox>

                    <div className="flex flex-row gap-2">
                        {isAppInitiatedAction && (
                            <Button
                                className="flex-1"
                                name="cancel-aia"
                                type="submit"
                                value="true"
                                color="default"
                            >
                                {msg("doCancel")}
                            </Button>
                        )}
                        <Button
                            className="flex-1"
                            type="submit"
                            value={msgStr("doSubmit")}
                            color="primary"
                            // variant={!isFormSubmittable ? "faded" : "solid"}
                        >
                            {msgStr("doSubmit")}
                        </Button>
                    </div>
                </div>
            </form>
        </Template>
    );
}
