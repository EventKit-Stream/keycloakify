import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";
import { Alert } from "@heroui/alert";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { message, client, skipLink } = kcContext;

    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("errorTitle")}
        >
            <div className="flex flex-col gap-4">
                <Alert color="danger">
                    <div className="text-base justify-start" dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                </Alert>
                {!skipLink && client !== undefined && client.baseUrl !== undefined && (
                    <Link href={client.baseUrl}>
                        {msg("backToApplication")}
                    </Link>
                )}
            </div>
        </Template>
    );
}
