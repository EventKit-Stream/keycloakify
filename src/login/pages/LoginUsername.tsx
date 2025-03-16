import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";

export default function LoginUsername(props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { social, realm, url, usernameHidden, login, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <span>
                    {msg("noAccount")}{" "}
                    <Link tabIndex={6} href={url.registrationUrl}>
                        {msg("doRegister")}
                    </Link>
                </span>
            }
            headerNode={msg("doLogIn")}
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div>
                            <Divider />
                            <h2 className="text-lg font-semibold text-center mt-2 mb-2">{msg("identity-provider-login-label")}</h2>
                            <ul className={social.providers.length <= 3 ? "grid grid-cols-1 gap-2" : "grid grid-cols-2 gap-2"}>
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
                                                {p.displayName}
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
                            className="flex flex-col gap-4"
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
                                    errorMessage={messagesPerField.getFirstError("username")}
                                    size="sm"
                                    labelPlacement="outside"
                                    aria-live="polite"
                                />
                            )}

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

                            <Button
                                tabIndex={4}
                                isDisabled={isLoginButtonDisabled}
                                name="login"
                                type="submit"
                                value={msgStr("doLogIn")}
                                className="flex items-center justify-center w-full rounded-lg"
                                color="primary"
                            >
                                {msgStr("doLogIn")}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}
