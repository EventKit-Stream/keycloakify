import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";

export default function DeleteAccountConfirm(props: PageProps<Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, triggered_from_aia } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("deleteAccountConfirm")}>
            <form className="flex flex-col gap-4" action={url.loginAction} method="post">
                <Alert
                    color="warning"
                    title={msg("irreversibleAction")}
                />
                <div>
                    <h2 className="text-base">{msg("deletingImplies")}</h2>
                    <ul className="list-disc ml-4">
                        <li>{msg("loggingOutImmediately")}</li>
                        <li>{msg("errasingData")}</li>
                    </ul>
                </div>
                <p className="text-base font-semibold">{msg("finalDeletionConfirmation")}</p>
                <div className="flex justify-between">
                    {triggered_from_aia && (
                        <Button
                            type="submit"
                            name="cancel-aia"
                            value="true"
                            color="default"
                        >
                            {msgStr("doCancel")}
                        </Button>
                    )}
                    <Button
                        type="submit"
                        value={msgStr("doConfirmDelete")}
                        color="danger"
                        variant="ghost"
                    >
                        {msgStr("doConfirmDelete")}
                    </Button>
                </div>
            </form>
        </Template>
    );
}
