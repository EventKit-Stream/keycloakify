import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";

export default function LoginIdpLinkEmail(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-email.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, realm, brokerContext, idpAlias } = kcContext;

    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("emailLinkIdpTitle", idpAlias)}
        >
            <div className="flex flex-col gap-2 text-sm">
                <p>
                    {msg("emailLinkIdp1", idpAlias, brokerContext.username, realm.displayName)}
                </p>
                <ul className="flex flex-col ml-8 list-disc gap-2">
                    <li>
                        {msg("emailLinkIdp2")} <Link className="text-sm" href={url.loginAction}>{msg("doClickHere")}</Link> {msg("emailLinkIdp3")}
                    </li>
                    <li>
                        {msg("emailLinkIdp4")} <Link className="text-sm" href={url.loginAction}>{msg("doClickHere")}</Link> {msg("emailLinkIdp5")}
                    </li>
                </ul>
            </div>
        </Template>
    );
}
