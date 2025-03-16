import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";

export default function Info(props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { advancedMsgStr, msg } = i18n;

    const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={kcSanitize(messageHeader ?? message.summary)}
        >
            <div className="flex flex-col gap-4">
                <p className="flex flex-col gap-1">
                    <span>{message.summary}</span>
                    {requiredActions && (
                        <ul className="flex flex-col gap-1 ml-8 font-bold text-sm" style={{ listStyleType: "disc" }}>
                            {requiredActions.map(requiredAction => <li key={requiredAction}>{advancedMsgStr(`requiredAction.${requiredAction}`)}</li>)}
                        </ul>
                    )}
                </p>
                {(() => {
                    if (skipLink) {
                        return null;
                    }

                    if (pageRedirectUri) {
                        return (
                            <Link href={pageRedirectUri}>{msg("backToApplication")}</Link>
                        );
                    }
                    if (actionUri) {
                        return (
                            <Link href={actionUri}>{msg("proceedWithAction")}</Link>
                        );
                    }

                    if (client.baseUrl) {
                        return (
                            <Link href={client.baseUrl}>{msg("backToApplication")}</Link>
                        );
                    }
                })()}
            </div>
        </Template>
    );
}
