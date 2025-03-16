import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

export default function LogoutConfirm(props: PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, client, logoutConfirm } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("logoutConfirmTitle")}>
            <div className="flex flex-col gap-4">
                <h3>{msg("logoutConfirmHeader")}</h3>
                <form className="form-actions" action={url.logoutConfirmAction} method="POST">
                    <input type="hidden" name="session_code" value={logoutConfirm.code} />
                    {/* IDK what this is */}
                    {/* <div id="kc-form-options">
                        <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
                    </div> */}
                    <Button
                        tabIndex={4}
                        name="confirmLogout"
                        type="submit"
                        color="primary"
                        value={msgStr("doLogout")}
                        size="sm"
                        className="w-full"
                    >
                        {msgStr("doLogout")}
                    </Button>
                </form>
                {!logoutConfirm.skipLink && client.baseUrl && (
                    <Link href={client.baseUrl}>{msg("backToApplication")}</Link>
                )}
            </div>
        </Template>
    );
}
