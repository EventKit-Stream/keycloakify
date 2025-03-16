import { useEffect } from "react";
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
import { Link } from "@heroui/link";

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
                absolute
                w-full
                z-10 sm:z-0
                text-left sm:text-center
                font-bold uppercase
                text-4xl sm:text-6xl
                text-gray-700 dark:text-slate-300
            ">
                {msg("loginTitleHtml", realm.displayNameHtml)}
            </h1>
            <Card
                className="
                    mt-0 sm:mt-24
                    rounded-none sm:rounded-2xl
                    w-full sm:w-96
                    h-svh sm:h-fit
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
                <CardBody className="flex flex-col gap-4">
                    {children}
                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <form action={url.loginAction} method="post" className="flex justify-center">
                            <input type="hidden" name="tryAnotherWay" value="on" />
                            <Link
                                href="#"
                                id="try-another-way"
                                onPress={() => {
                                    document.forms["kc-select-try-another-way-form" as never].submit();
                                    return false;
                                }}
                            >
                                {msg("doTryAnotherWay")}
                            </Link>
                        </form>
                    )}
                    {socialProvidersNode}
                </CardBody>
                {displayInfo && (
                    <>
                        <Divider />
                        <CardFooter className="flex flex-col items-center justify-start">
                            {infoNode}
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}
