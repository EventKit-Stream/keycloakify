import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@heroui/button";

type LoginUpdateProfileProps = PageProps<Extract<KcContext, { pageId: "login-update-profile.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function LoginUpdateProfile(props: LoginUpdateProfileProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { messagesPerField, url, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayRequiredFields
            headerNode={msg("loginProfileTitle")}
            displayMessage={messagesPerField.exists("global")}
        >
            <form id="kc-update-profile-form" action={url.loginAction} method="post">
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
                    <div className="flex flex-row gap-2">
                        {isAppInitiatedAction && (
                            <Button
                                className="flex-1"
                                name="cancel-aia"
                                formNoValidate
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
