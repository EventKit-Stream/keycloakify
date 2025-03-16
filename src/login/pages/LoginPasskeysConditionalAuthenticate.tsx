import { Fragment, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useScript } from "keycloakify/login/pages/LoginPasskeysConditionalAuthenticate.useScript";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "@heroui/input";

export default function LoginPasskeysConditionalAuthenticate(
    props: PageProps<Extract<KcContext, { pageId: "login-passkeys-conditional-authenticate.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { messagesPerField, login, url, usernameHidden, shouldDisplayAuthenticators, authenticators, registrationDisabled, realm } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const authButtonId = "authenticateWebAuthnButton";

    useScript({ authButtonId, kcContext, i18n });

    const [isSubmit, setIsSubmit] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("passkey-login-title")}
            infoNode={
                realm.registrationAllowed &&
                !registrationDisabled && (
                    <span>
                        {msg("noAccount")}{" "}
                        <Link tabIndex={6} href={url.registrationUrl}>
                            {msg("doRegister")}
                        </Link>
                    </span>
                )
            }
        >
            <p>IF YOU SEE THIS PAGE PLEASE CONTACT THE ADMINISTRATOR</p>
            <form id="webauth" action={url.loginAction} method="post">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="authenticatorData" name="authenticatorData" />
                <input type="hidden" id="signature" name="signature" />
                <input type="hidden" id="credentialId" name="credentialId" />
                <input type="hidden" id="userHandle" name="userHandle" />
                <input type="hidden" id="error" name="error" />
            </form>
            {authenticators !== undefined && Object.keys(authenticators).length !== 0 && (
                <>
                    <form id="authn_select">
                        {authenticators.authenticators.map((authenticator, i) => (
                            <input key={i} type="hidden" name="authn_use_chk" readOnly value={authenticator.credentialId} />
                        ))}
                    </form>
                    {shouldDisplayAuthenticators && (
                        <>
                            {authenticators.authenticators.length > 1 && (
                                <h3 className="text-base text-center">{msg("passkey-available-authenticators")}</h3>
                            )}
                            <div className="flex flex-col gap-4">
                            {authenticators.authenticators.map((authenticator, i) => (
                            <Button
                                key={i}
                                type="submit"
                                name="authenticationExecution"
                                value={authenticator.credentialId}
                                variant="ghost"
                                color="primary"
                                startContent={
                                    <Icon className="text-2xl w-8" icon="hugeicons:authorized" />
                                }
                                className="h-fit p-2 w-full"
                            >
                                <div className="text-wrap flex-col text-start w-full">
                                    <h4 className="text-base font-semibold">{advancedMsg(authenticator.label)}</h4>
                                    <div className="flex flex-col text-sm text-default-900">
                                    {authenticator.transports !== undefined &&
                                        authenticator.transports.displayNameProperties !== undefined &&
                                        authenticator.transports.displayNameProperties.length !== 0 && (
                                            <span>
                                                {authenticator.transports.displayNameProperties.map((nameProperty, i, arr) => (
                                                    <Fragment key={i}>
                                                        <span>{advancedMsg(nameProperty)}</span>
                                                        {i !== arr.length - 1 && <span>, </span>}
                                                    </Fragment>
                                                ))}
                                            </span>
                                        )}
                                        <span>{msg("passkey-createdAt-label")}</span>
                                        <span>{authenticator.createdAt}</span>
                                    </div>
                                </div>
                            </Button>
                            ))}
                            </div>
                        </>
                    )}
                </>
            )}
            {realm.password && (
                <form
                    action={url.loginAction}
                    method="post"
                    // style={{ display: "none" }}
                    onSubmit={() => {
                        try {
                            // // @ts-expect-error
                            setIsSubmit(true);
                        } catch (error) {
                            console.error(error);
                            setIsSubmit(false);
                            // Ignore error if login button doesn't exist
                        }
                        return true;
                    }}
                >
                    {!usernameHidden && (
                        <Input
                            label={msg("passkey-autofill-select")}
                            tabIndex={1}
                            aria-invalid={messagesPerField.existsError("username")}
                            name="username"
                            defaultValue={login.username ?? ""}
                            autoComplete="username webauthn"
                            type="text"
                            autoFocus
                            isInvalid={messagesPerField.existsError("username")}
                            errorMessage={messagesPerField.get("username")}
                            size="sm"
                            labelPlacement="outside"
                            aria-live="polite"
                            isDisabled={isSubmit}
                        />
                    )}
                </form>
            )}
            <Button
                autoFocus
                value={msgStr("passkey-doAuthenticate")}
                type="submit"
                color="primary"
            >
                {msgStr("passkey-doAuthenticate")}
            </Button>
        </Template>
    );
}
