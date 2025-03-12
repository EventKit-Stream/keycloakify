import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";

type UpdateEmailProps = PageProps<Extract<KcContext, { pageId: "update-email.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function UpdateEmail(props: UpdateEmailProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { msg, msgStr } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields
            headerNode={msg("updateEmailTitle")}
        >
            <form id="kc-update-email-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                <UserProfileFormFields
                    kcContext={kcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />

                <div className="flex flex-col gap-2">
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        {/* IDK What this does */}
                        <div className={kcClsx("kcFormOptionsWrapperClass")} />
                    </div>

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
                            isDisabled={!isFormSubmittable}
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
