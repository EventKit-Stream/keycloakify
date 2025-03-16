import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

export default function LoginIdpLinkConfirmOverride(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm-override.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;


    const { url, idpDisplayName } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("confirmOverrideIdpTitle")}>
            <form className="flex flex-col gap-4" action={url.loginAction} method="post">
                <span>
                    {msg("pageExpiredMsg1")}{" "}
                    <Link href={url.loginRestartFlowUrl}>
                        {msg("doClickHere")}
                    </Link>
                </span>
                <Button
                    color="warning"
                    variant="ghost"
                    type="submit"
                    name="submitAction"
                    value="confirmCancel"
                    className="text-base"
                >
                    {msg("confirmOverrideIdpContinue", idpDisplayName)}
                </Button>
            </form>
        </Template>
    );
}
