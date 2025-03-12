import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [isPasswordRevealed, toggleIsPasswordRevealed] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <span>
                    {msg("noAccount")}{" "}
                    <Link tabIndex={8} href={url.registrationUrl}>
                        {msg("doRegister")}
                    </Link>
                </span>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div>
                            <Divider />
                            <h2 className="text-lg">{msg("identity-provider-login-label")}</h2>
                            <ul className={social.providers.length <= 3 ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 gap-4"}>
                                {social.providers.map((...[p]) => (
                                    <li key={p.alias}>
                                        <Button
                                            as={Link}
                                            href={p.loginUrl}
                                            className="flex items-center gap-4"
                                            variant="faded"
                                        >
                                            {p.iconClasses && <Icon icon={p.iconClasses.split(" ")[1].replace("-", ":")} aria-hidden="true" />}
                                            <span>
                                                {kcSanitize(p.displayName)}
                                            </span>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            {!usernameHidden && (
                                <Input
                                    label={!realm.loginWithEmailAllowed
                                        ? msg("username")
                                        : !realm.registrationEmailAsUsername
                                            ? msg("usernameOrEmail")
                                            : msg("email")}
                                    tabIndex={2}
                                    name="username"
                                    defaultValue={login.username ?? ""}
                                    autoFocus
                                    autoComplete="username"
                                    aria-invalid={messagesPerField.existsError("username", "password")}
                                    isInvalid={messagesPerField.existsError("username", "password")}
                                    errorMessage={kcSanitize(messagesPerField.getFirstError("username", "password"))}
                                    size="sm"
                                    labelPlacement="outside"
                                    aria-live="polite"
                                />
                            )}
                            <Input
                                label={msg("password")}
                                tabIndex={3}
                                name="password"
                                defaultValue={login.username ?? ""}
                                autoFocus
                                autoComplete="current-password"
                                aria-invalid={messagesPerField.existsError("username", "password")}
                                isInvalid={usernameHidden && messagesPerField.existsError("username", "password")}
                                errorMessage={kcSanitize(messagesPerField.getFirstError("username", "password"))}
                                size="sm"
                                labelPlacement="outside"
                                type={isPasswordRevealed ? "text" : "password"}
                                endContent={
                                    <>
                                        <Divider orientation="vertical" className="mr-2"/>
                                        <Button
                                            className="text-lg"
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="primary"
                                            aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                                            aria-controls={"password"}
                                            onPress={() => {
                                                toggleIsPasswordRevealed(!isPasswordRevealed)
                                            }}
                                        >
                                            {isPasswordRevealed ? <Icon icon="ri:eye-off-line" />: <Icon icon="ri:eye-line" />}
                                        </Button>
                                    </>
                                }
                            />

                            <div className="flex justify-between mt-4">
                                {realm.rememberMe && !usernameHidden && (
                                    <Checkbox
                                        tabIndex={5}
                                        name="rememberMe"
                                        checked={!!login.rememberMe}
                                        size="sm"
                                    >
                                        {msg("rememberMe")}
                                    </Checkbox>
                                )}
                                {realm.resetPasswordAllowed && (
                                    <Link tabIndex={6} href={url.loginResetCredentialsUrl} className="text-sm">
                                        {msg("doForgotPassword")}
                                    </Link>
                                )}
                            </div>

                            <div className="mt-4">
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <Button
                                    tabIndex={7}
                                    isDisabled={isLoginButtonDisabled}
                                    name="login"
                                    type="submit"
                                    value={msgStr("doLogIn")}
                                    className="flex items-center justify-center w-full rounded-lg"
                                    color="primary"
                                >
                                    {msgStr("doLogIn")}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}
