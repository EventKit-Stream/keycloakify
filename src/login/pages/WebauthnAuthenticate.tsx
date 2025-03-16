import { Fragment } from "react";
import { useScript } from "keycloakify/login/pages/WebauthnAuthenticate.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default function WebauthnAuthenticate(props: PageProps<Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const authButtonId = "authenticateWebAuthnButton";

    useScript({
        authButtonId,
        kcContext,
        i18n
    });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <span>
                    {msg("noAccount")}{" "}
                    <Link tabIndex={6} href={url.registrationUrl}>
                        {msg("doRegister")}
                    </Link>
                </span>
            }
            headerNode={msg("webauthn-login-title")}
        >
            <div id="kc-form-webauthn">
                <form id="webauth" action={url.loginAction} method="post">
                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                    <input type="hidden" id="authenticatorData" name="authenticatorData" />
                    <input type="hidden" id="signature" name="signature" />
                    <input type="hidden" id="credentialId" name="credentialId" />
                    <input type="hidden" id="userHandle" name="userHandle" />
                    <input type="hidden" id="error" name="error" />
                </form>
                <div className="flex flex-col gap-4">
                    {authenticators && (
                        <>
                            <form id="authn_select">
                                {authenticators.authenticators.map(authenticator => (
                                    <input key={authenticator.credentialId} type="hidden" name="authn_use_chk" value={authenticator.credentialId} />
                                ))}
                            </form>

                            {shouldDisplayAuthenticators && (
                                <div>
                                    {authenticators.authenticators.length > 1 && (
                                        <p className="text-lg text-center">{msg("webauthn-available-authenticators")}</p>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        {authenticators.authenticators.map((authenticator, i) => (
                                            <Card key={i} isBlurred shadow="sm" className="bg-background/60 dark:bg-default-100/50">
                                                <CardBody className="flex flex-row items-center gap-2">
                                                    <div className="w-16 h-16 flex items-center justify-center">
                                                        <Icon className="text-4xl" icon="lucide:key-round" />
                                                        {/* <div className={kcClsx("kcSelectAuthListItemIconClass")}>
                                                            <i
                                                                className={clsx(
                                                                    (() => {
                                                                        const className = kcClsx(authenticator.transports.iconClass as any);
                                                                        if (className === authenticator.transports.iconClass) {
                                                                            return kcClsx("kcWebAuthnDefaultIcon");
                                                                        }
                                                                        return className;
                                                                    })(),
                                                                    kcClsx("kcSelectAuthListItemIconPropertyClass")
                                                                )}
                                                            />
                                                        </div> */}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h2 className="text-base font-semibold">{advancedMsg(authenticator.label)}</h2>
                                                        {authenticator.transports.displayNameProperties?.length && (
                                                            <span className="text-sm text-gray-500">
                                                                {authenticator.transports.displayNameProperties
                                                                    .map((displayNameProperty, i, arr) => ({
                                                                        displayNameProperty,
                                                                        hasNext: i !== arr.length - 1
                                                                    }))
                                                                    .map(({ displayNameProperty, hasNext }) => (
                                                                        <Fragment key={displayNameProperty}>
                                                                            {advancedMsg(displayNameProperty)}
                                                                            {hasNext && <span>, </span>}
                                                                        </Fragment>
                                                                    ))}
                                                            </span>
                                                        )}
                                                        <span className="text-sm text-gray-500">
                                                            {msg("webauthn-createdAt-label")}: {authenticator.createdAt}
                                                        </span>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <Button
                        autoFocus
                        type="submit"
                        id={authButtonId}
                        value={msgStr("webauthn-doAuthenticate")}
                        className="flex items-center justify-center w-full rounded-lg"
                        color="primary"
                    >
                        {msgStr("doLogIn")}
                    </Button>
                </div>
            </div>
        </Template>
    );
}
