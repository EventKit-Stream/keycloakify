import { Fragment } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Radio, RadioGroup } from "@heroui/radio";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cn } from "@heroui/react";

export default function LoginResetOtp(props: PageProps<Extract<KcContext, { pageId: "login-reset-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;


    const { url, messagesPerField, configuredOtpCredentials } = kcContext;

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
            <form id="kc-otp-reset-form" className="flex flex-col gap-4" action={url.loginAction} method="post">
                    <RadioGroup
                        label={msg("otp-reset-description")}
                        defaultValue={configuredOtpCredentials.selectedCredentialId}
                        orientation="horizontal"
                        classNames={{
                            label: "text-normal text-base",
                            wrapper: "w-full justify-evenly",
                        }}
                        isInvalid={messagesPerField.existsError("totp")}
                        errorMessage={messagesPerField.get("totp")}
                    >
                        {configuredOtpCredentials.userOtpCredentials.map((otpCredential, index) => (
                            <Fragment key={otpCredential.id}>
                                <Radio
                                    value={otpCredential.id}
                                    tabIndex={index}
                                    name="selectedCredentialId"
                                    classNames={{
                                        base: cn(
                                            "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                                            "flex-row-reverse w-fit max-w-[300px] cursor-pointer rounded-lg border-2 border-transparent",
                                            "data-[selected=true]:border-primary",
                                            "data-[invalid=true]:border-danger data-[invalid=true]:border-1",
                                            "flex-1 justify-center",
                                        ),
                                        wrapper: "hidden",
                                        control: "hidden",
                                        label: "-ml-2",
                                    }}
                                >
                                    <span className="flex text-sm items-center gap-2">
                                        <Icon className="text-2xl" icon="hugeicons:authorized" aria-hidden="true" />
                                        {otpCredential.userLabel}
                                    </span>
                                </Radio>
                            </Fragment>
                        ))}
                    </RadioGroup>
                    <Button
                        type="submit"
                        value={msgStr("doSubmit")}
                        color="primary"
                    >
                        {msgStr("doLogIn")}
                    </Button>
            </form>
        </Template>
    );
}
