import { useEffect } from "react";
// import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Alert } from "@heroui/alert";

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
        <div className="flex flex-col h-screen items-center">
            <h1 className="
                flex
                z-10 sm:z-0
                w-full h-20 font-bold uppercase
                justify-start sm:justify-center
                text-4xl sm:text-6xl
                ml-16 sm:ml-0
                mt-4 sm:mt-[15vh] -mb-6 sm:mb-[5vh]
                text-gray-700 dark:text-slate-300
            ">
                {msg("loginTitleHtml", realm.displayNameHtml)}
            </h1>
            <Card
                className="
                    h-full sm:h-auto
                    w-full sm:w-96
                "
                isBlurred
                shadow="sm"
            >
                <CardHeader className="flex-col items-centre">
                    {enabledLanguages.length > 1 && (
                        <div className="flex w-full justify-end items-center">
                            <Select
                                className="w-36"
                                size="sm"
                                variant="faded"
                                startContent={<Icon icon="bi:translate" />}
                                defaultSelectedKeys={[currentLanguage.languageTag]}
                                items={enabledLanguages}
                            >
                                {(language) => (
                                    <SelectItem
                                        key={language.languageTag}
                                        textValue={language.label}
                                        href={language.href}
                                    >
                                        <div className="flex items-center gap-2">
                                        <Chip
                                            size="sm"
                                            radius="sm"
                                            variant="faded"
                                        >
                                            {language.languageTag}
                                        </Chip>
                                        {language.label}
                                        </div>
                                    </SelectItem>
                                )}
                            </Select>
                        </div>
                    )}
                    {(() => {
                        const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                            <h1 className="text-lg sm:text-2xl font-semibold">{headerNode}</h1>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-base sm:text-lg font-normal ">{auth.attemptedUsername}</span>
                                <Tooltip content={msg("restartLoginTooltip")}>
                                    <a aria-label={msgStr("restartLoginTooltip")} href={url.loginRestartFlowUrl}>
                                        <Button isIconOnly size="sm" color="primary" variant="light">
                                            <Icon icon="mdi:restart" />
                                        </Button>
                                    </a>
                                </Tooltip>
                            </div>
                        );

                        if (displayRequiredFields) {
                            return (
                                <div className="flex flex-col w-full items-center gap-2">
                                    <div>{node}</div>
                                    <div className="flex w-full justify-end items-center gap-1 mr-16">
                                        <span className="text-danger">*</span>
                                        <span>{msg("requiredFields")}</span>
                                    </div>
                                </div>
                            );
                        }

                        return node;
                    })()}
                    {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <Alert
                            className="py-2 items-center"
                            variant="faded"
                            color={
                                message.type === "success" ? "success" :
                                message.type === "warning" ? "warning" :
                                message.type === "error" ? "danger" :
                                message.type === "info" ? "primary" :
                                "default"
                            }
                            title={kcSanitize(message.summary)}
                        />
                    )}
                </CardHeader>
                <CardBody>
                    {children}
                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <form action={url.loginAction} method="post" className="flex justify-center">
                            <input type="hidden" name="tryAnotherWay" value="on" />
                            <a
                                href="#"
                                id="try-another-way"
                                onClick={() => {
                                    document.forms["kc-select-try-another-way-form" as never].submit();
                                    return false;
                                }}
                            >
                                {msg("doTryAnotherWay")}
                            </a>
                        </form>
                    )}
                    {socialProvidersNode}
                </CardBody>
                {displayInfo && (
                    <>
                        <Divider />
                        <CardFooter className="flex items-center justify-center">
                            {infoNode}
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}
