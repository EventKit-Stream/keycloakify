import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@heroui/button";

export default function SelectAuthenticator(props: PageProps<Extract<KcContext, { pageId: "select-authenticator.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, auth } = kcContext;

    const { msg, advancedMsg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={false}
            headerNode={msg("loginChooseAuthenticator")}
        >
            <form id="kc-select-credential-form" action={url.loginAction} method="post">
                <div className="flex flex-col gap-4">
                    {auth.authenticationSelections.map((authenticationSelection, i) => (
                        <Button
                            key={i}
                            type="submit"
                            name="authenticationExecution"
                            value={authenticationSelection.authExecId}
                            variant="ghost"
                            color="primary"
                            startContent={
                                <div className="text-2xl w-8">
                                    {(() => {
                                        if (!authenticationSelection.iconCssClass) return null;
                                        switch (true) {
                                            case authenticationSelection.iconCssClass === 'kcAuthenticatorOTPClass':
                                                return <Icon icon="hugeicons:authorized" />;
                                            case authenticationSelection.iconCssClass === 'kcAuthenticatorWebAuthnClass':
                                                return <Icon icon="hugeicons:lock-key" />;
                                            case authenticationSelection.iconCssClass === 'kcAuthenticatorPasswordClass':
                                                return <Icon icon="hugeicons:lock-password" />;
                                            case authenticationSelection.iconCssClass === 'kcAuthenticatorWebAuthnPasswordlessClass':
                                                return <Icon icon="hugeicons:shield-key" />;
                                            default:
                                                return <Icon icon="hugeicons:security-lock" />;
                                        }
                                    })()}
                                </div>
                            }
                            endContent={<div className="text-lg w-8"><Icon icon="hugeicons:arrow-right-double" /></div>}
                            className="h-fit p-2 w-full"
                        >
                            <div className="text-wrap flex-col text-start w-full">
                                <h4 className="text-base font-semibold">{advancedMsg(authenticationSelection.displayName)}</h4>
                                <p className="text-sm text-default-900">{advancedMsg(authenticationSelection.helpText)}</p>
                            </div>
                        </Button>
                    ))}
                </div>
            </form>
        </Template>
    );
}
