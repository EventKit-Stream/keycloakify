import { Fragment } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Radio, RadioGroup } from "@heroui/radio";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { cn } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { otpLogin, url, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("totp")}
            headerNode={msg("doLogIn")}
        >
            <form action={url.loginAction} method="post">
                {otpLogin.userOtpCredentials.length > 1 && (
                    <RadioGroup
                        defaultValue={otpLogin.selectedCredentialId}
                        orientation="horizontal"
                        classNames={{
                            wrapper: "w-full justify-evenly",
                        }}
                    >
                        {otpLogin.userOtpCredentials.map((otpCredential, index) => (
                            <Fragment key={index}>
                                <Radio
                                    value={otpCredential.id}
                                    tabIndex={index}
                                    name="selectedCredentialId"
                                    classNames={{
                                        base: cn(
                                            "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                                            "flex-row-reverse w-fit max-w-[300px] cursor-pointer rounded-lg border-2 border-transparent",
                                            "data-[selected=true]:border-primary",
                                            "flex-1 justify-center",
                                        ),
                                        wrapper: "hidden",
                                        control: "hidden",
                                        label: "-ml-2",
                                    }}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon icon="hugeicons:authorized" aria-hidden="true" />
                                        {otpCredential.userLabel}
                                    </span>
                                </Radio>
                            </Fragment>
                        ))}
                    </RadioGroup>
                )}
                <Input
                    label={msg("loginOtpOneTime")}
                    name="otp"
                    autoComplete="off"
                    type="text"
                    autoFocus
                    aria-invalid={messagesPerField.existsError("totp")}
                    isInvalid={messagesPerField.existsError("totp")}
                    errorMessage={kcSanitize(messagesPerField.get("totp"))}
                    size="sm"
                    labelPlacement="outside"
                    aria-live="polite"
                />
                <div className="flex justify-end mt-4">
                    {/* IDK what this is */}
                    {/* <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
                    </div> */}
                    <Button
                        name="login"
                        type="submit"
                        value={msgStr("doLogIn")}
                        color="primary"
                    >
                        {msgStr("doLogIn")}
                    </Button>
                </div>
            </form>
        </Template>
    );
}
