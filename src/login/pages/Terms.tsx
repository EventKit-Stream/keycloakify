import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";

export default function Terms(props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg, msgStr } = i18n;

    const { url } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("termsTitle")}
        >
            <ScrollShadow className="text-sm px-8">{msg("termsText")}</ScrollShadow>
            <form className="flex flex-row justify-end gap-2" action={url.loginAction} method="POST">
                <Button
                    color="danger"
                    name="cancel"
                    type="submit"
                    value={msgStr("doDecline")}
                    variant="ghost"
                >
                    {msgStr("doDecline")}
                </Button>
                <Button
                    color="primary"
                    name="accept"
                    type="submit"
                    value={msgStr("doAccept")}
                >
                    {msgStr("doAccept")}
                </Button>
            </form>
            {/* IDK what the following is */}
            {/* <div className="clearfix" /> */}
        </Template>
    );
}
