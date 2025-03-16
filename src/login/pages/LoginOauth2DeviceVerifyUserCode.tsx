import { PageProps } from "keycloakify/login/pages/PageProps";
import { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

export default function LoginOauth2DeviceVerifyUserCode(
    props: PageProps<Extract<KcContext, { pageId: "login-oauth2-device-verify-user-code.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { url } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("oauth2DeviceVerificationTitle")}
        >
            <form
                id="kc-user-verify-device-user-code-form"
                className="flex flex-col gap-4"
                action={url.oauth2DeviceVerificationAction}
                method="post"
            >
                <Input
                    label={msg("verifyOAuth2DeviceUserCode")}
                    name="device_user_code"
                    autoComplete="off"
                    autoFocus
                    size="sm"
                    labelPlacement="outside"
                />
                <div className="flex justify-end">
                    {/* IDK what this is */}
                    {/* <div id="kc-form-options">
                        <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
                    </div> */}
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
