import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

import { Avatar, Badge, Box, Button, Card, DataList, Flex, Heading, IconButton, Link, ScrollArea, Text, Theme, ThemePanel, Tooltip } from "@radix-ui/themes";
import { Icon } from "@iconify/react";


export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <Theme className="light-theme" accentColor="mint" panelBackground="translucent" grayColor="sand" radius="large" scaling="100%" hasBackground={false}>
            <Box className={kcClsx("kcLoginClass")}>
                <Box id="kc-header" className={kcClsx("kcHeaderClass")}>
                    <Heading id="kc-header-wrapper" style={{textTransform: "uppercase"}}>{msg("loginTitleHtml", realm.displayNameHtml)}</Heading>
                </Box>

                <Box>
                    <Card asChild>
                    <Box className={kcClsx("kcFormCardClass")} >
                    <header className={kcClsx("kcFormHeaderClass")}>
                        {enabledLanguages.length > 1 && (
                            <div className={kcClsx("kcLocaleMainClass")} id="kc-locale">
                                <div id="kc-locale-wrapper" className={kcClsx("kcLocaleWrapperClass")}>
                                    <div id="kc-locale-dropdown" className={clsx("menu-button-links", kcClsx("kcLocaleDropDownClass"))}>
                                        <Button
                                            tabIndex={1}
                                            // id="kc-current-locale-link"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                            aria-controls="language-switch1"
                                            aria-label={msgStr("languages")}
                                        >
                                            <Icon icon="bi:translate" /> {currentLanguage.label} <Icon icon="bi:chevron-down" />
                                        </Button>
                                        <ul
                                            role="menu"
                                            tabIndex={-1}
                                            aria-labelledby="kc-current-locale-link"
                                            aria-activedescendant=""
                                            id="language-switch1"
                                            className={kcClsx("kcLocaleListClass")}
                                            style={{ backgroundColor: "Transparent" }}
                                        >
                                            <Card style={{ height: 180 }}>
                                            <ScrollArea>
                                                {enabledLanguages.map(({ languageTag, label, href }, i) => (
                                                    <li key={languageTag} className={kcClsx("kcLocaleListItemClass")} role="none">
                                                        <Link role="menuitem" id={`language-${i + 1}`} href={href}>
                                                            {label}
                                                        </Link>
                                                        {/* <a role="menuitem" id={`language-${i + 1}`} className={kcClsx("kcLocaleItemClass")} href={href}>
                                                            {label}
                                                        </a> */}
                                                    </li>
                                                ))}
                                            </ScrollArea>
                                            </Card>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                        {(() => {
                            const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                <Heading size="4">{headerNode}</Heading>
                            ) : (
                                <Box>
                                    <Flex gap="1rem" align="center" justify="center">
                                        <Text size="5">{auth.attemptedUsername}</Text>
                                        <Tooltip aria-label={msgStr("restartLoginTooltip")} content={msg("restartLoginTooltip")} side="right">
                                            <Link href={url.loginRestartFlowUrl} style={{lineHeight: "0"}}>
                                                <IconButton size="1" variant="ghost" color="gray">
                                                    <Icon icon="mdi:restart" />
                                                </IconButton>
                                            </Link>
                                        </Tooltip>
                                    </Flex>
                                </Box>
                            );

                            if (displayRequiredFields) {
                                return (
                                    <div className={kcClsx("kcContentWrapperClass")}>
                                        <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                            <span className="subtitle">
                                                <Text color="crimson">*</Text>
                                                <Text>{msg("requiredFields")}</Text>
                                            </span>
                                        </div>
                                        <div className="col-md-10">{node}</div>
                                    </div>
                                );
                            }

                            return node;
                        })()}
                    </header>
                    <Box id="kc-content">
                        <div id="kc-content-wrapper">
                            {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                            {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                                <Badge variant="surface" size="3" style={{width: "100%"}} color={
                                                message.type === "success" ? "green" : 
                                                message.type === "warning" ? "orange" : 
                                                message.type === "error" ? "crimson" : 
                                                message.type === "info" ? "blue" : "gray" }>
                                    <Flex gap="0.5rem" align="center" style={{padding: "0.5rem 1rem"}}>
                                        <Text size="5" style={{lineHeight: "0"}}>
                                            <Icon icon={
                                                message.type === "success" ? "bi:check-circle" : 
                                                message.type === "warning" ? "bi:exclamation-triangle" : 
                                                message.type === "error" ? "bi:exclamation-circle" : 
                                                message.type === "info" ? "bi:info-circle" : "bi:info-circle" } />
                                        </Text>
                                        <Text as="p" wrap="balance" size="4" trim="end" dangerouslySetInnerHTML={{
                                            // __html: kcSanitize(message.summary)
                                            __html: kcSanitize(message.summary)
                                        }}></Text>
                                    </Flex>
                                </Badge>
                            )}
                            {children}
                            {auth !== undefined && auth.showTryAnotherWayLink && (
                                <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                    <div className={kcClsx("kcFormGroupClass")}>
                                        <input type="hidden" name="tryAnotherWay" value="on" />
                                        <Link
                                            href="#"
                                            id="try-another-way"
                                            onClick={() => {
                                                document.forms["kc-select-try-another-way-form" as never].submit();
                                                return false;
                                            }}
                                        >
                                            {msg("doTryAnotherWay")}
                                        </Link>
                                    </div>
                                </form>
                            )}
                            {socialProvidersNode}
                            {displayInfo && (
                                <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                                    <Flex width="100%" height="56px" align="center" justify="center">
                                        {infoNode}
                                    </Flex>
                                </div>
                            )}
                        </div>
                    </Box>
                    </Box>
                    </Card>
                </Box>
            </Box>
        </Theme>
    );
}
