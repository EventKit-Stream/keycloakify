import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@heroui/button";

export default function WebauthnError(props: PageProps<Extract<KcContext, { pageId: "webauthn-error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage
            headerNode={msg("webauthn-error-title")}
        >
            <form id="kc-error-credential-form" action={url.loginAction} method="post">
                <input type="hidden" id="executionValue" name="authenticationExecution" />
                <input type="hidden" id="isSetRetry" name="isSetRetry" />
            </form>
            <Button
                tabIndex={4}
                name="try-again"
                value={msgStr("doTryAgain")}
                className="text-lg"
                color="primary"
                size="sm"
                onPress={() => {
                    // @ts-expect-error: Trusted Keycloak's code
                    document.getElementById("isSetRetry").value = "retry";
                    // @ts-expect-error: Trusted Keycloak's code
                    document.getElementById("executionValue").value = "${execution}";
                    // @ts-expect-error: Trusted Keycloak's code
                    document.getElementById("kc-error-credential-form").submit();
                }}
            >
                {msgStr("doTryAgain")}
            </Button>
            {isAppInitiatedAction && (
                <form action={url.loginAction} id="kc-webauthn-settings-form" method="post">
                    <Button
                        name="cancel-aia"
                        value="true"
                        type="submit"
                        size="sm"
                        className="text-base w-full"
                    >
                        {msgStr("doCancel")}
                    </Button>
                </form>
            )}
        </Template>
    );
}
