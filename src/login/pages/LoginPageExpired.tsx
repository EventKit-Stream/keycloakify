import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url } = kcContext;

    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("pageExpiredTitle")}
        >
        <div className="flex flex-col gap-2 w-fit self-center">
            <p className="flex flex-row gap-1">
                {msg("pageExpiredMsg1")}
                <Link id="loginRestartLink" href={url.loginRestartFlowUrl}>
                    {msg("doClickHere")}
                </Link>{" "}
            </p>
            <p className="flex flex-row gap-2">
                {msg("pageExpiredMsg2")}{" "}
                <Link id="loginContinueLink" href={url.loginAction}>
                    {msg("doClickHere")}
                </Link>{" "}
            </p>
        </div>
        </Template>
    );
}
