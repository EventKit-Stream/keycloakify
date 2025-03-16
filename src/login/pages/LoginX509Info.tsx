import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Snippet } from "@heroui/snippet";
import { Spacer } from "@heroui/spacer";
import { Button } from "@heroui/button";

export default function LoginX509Info(props: PageProps<Extract<KcContext, { pageId: "login-x509-info.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, x509 } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("doLogIn")}>
            <form id="kc-x509-login-info" className="flex flex-col gap-4" action={url.loginAction} method="post">

                <div>
                    <h3>
                        {msg("clientCertificate")}
                    </h3>
                    {x509.formData.subjectDN ? (
                        <Snippet symbol="" hideCopyButton className="w-full">{
                            x509.formData.subjectDN.split(",").map((...[line]) => (
                                <span key={line}>
                                    {line}
                                </span>
                            ))
                        }</Snippet>
                    ) : (
                        <Snippet symbol="" hideCopyButton>{msg("noCertificate")}</Snippet>
                    )}
                </div>

                <div >
                    {x509.formData.isUserEnabled && (
                        <div className="flex items-center">
                            {msg("doX509Login")}
                            <Spacer x={1} />
                            <span className="font-semibold">
                                {x509.formData.username}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-row gap-2">
                    {x509.formData.isUserEnabled && (
                        <Button
                            className="flex-1"
                            name="cancel"
                            type="submit"
                            value={msgStr("doIgnore")}
                            color="default"
                        >
                            {msg("doIgnore")}
                        </Button>
                    )}
                    <Button
                        className="flex-1"
                        name="login"
                        type="submit"
                        value={msgStr("doContinue")}
                        color="primary"
                        // variant={!isFormSubmittable ? "faded" : "solid"}
                    >
                        {msgStr("doContinue")}
                    </Button>
                </div>
            </form>
        </Template>
    );
}
