import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@heroui/button";

export default function DeleteCredential(props: PageProps<Extract<KcContext, { pageId: "delete-credential.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msgStr, msg } = i18n;

    const { url, credentialLabel } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("deleteCredentialTitle", credentialLabel)}
        >
            <h2 className="text-base">{msg("deleteCredentialMessage", credentialLabel)}</h2>
            <form className="flex flex-row gap-2" action={url.loginAction} method="POST">
                <Button
                    className="flex-1"
                    name="cancel-aia"
                    type="submit"
                    value={msgStr("doCancel")}
                    color="default"
                >
                    {msg("doCancel")}
                </Button>
                <Button
                    className="flex-1"
                    name="accept"
                    type="submit"
                    value={msgStr("doConfirmDelete")}
                    color="danger"
                    variant="ghost"
                >
                    {msgStr("doConfirmDelete")}
                </Button>
            </form>
            <div className="clearfix" />
        </Template>
    );
}
