import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg } = i18n;

    const { url, user } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            headerNode={msg("emailVerifyTitle")}
            infoNode={
                <p className="flex flex-col gap-1 items-center">
                    <span>{msg("emailVerifyInstruction2")}</span>
                    <span>
                        <Link href={url.loginAction}>{msg("doClickHere")}</Link>
                        &nbsp;
                        {msg("emailVerifyInstruction3")}
                    </span>
                </p>
            }
        >
            <p>{msg("emailVerifyInstruction1", user?.email ?? "")}</p>
        </Template>
    );
}
