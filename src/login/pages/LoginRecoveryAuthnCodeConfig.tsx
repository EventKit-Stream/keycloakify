import { useScript } from "keycloakify/login/pages/LoginRecoveryAuthnCodeConfig.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox } from "@heroui/checkbox";
import { useState } from "react";

export default function LoginRecoveryAuthnCodeConfig(props: PageProps<Extract<KcContext, { pageId: "login-recovery-authn-code-config.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { recoveryAuthnCodesConfigBean, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const olRecoveryCodesListId = "kc-recovery-codes-list";

    useScript({ olRecoveryCodesListId, i18n });

    const [isSaved, setIsSaved] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("recovery-code-config-header")}
        >
            <div><Alert
                color="warning"
                title={msg("recovery-code-config-warning-title")}
                description={msg("recovery-code-config-warning-message")}
                className="h-fit"
                classNames={{
                    title: "text-base font-semibold mb-2",
                    description: "text-sm"
                }}
            /></div>

            <ol className="grid grid-cols-2 gap-2 border-1 border-gray-200 rounded-lg p-4">
                {recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList.map((code, index) => (
                    <li key={index}>
                        <span className="text-gray-500">{index + 1}:</span> {code.slice(0, 4)}-{code.slice(4, 8)}-{code.slice(8)}
                    </li>
                ))}
            </ol>

            {/* actions */}
            <div className="flex gap-2 justify-evenly">
                <Button
                    color="primary"
                    variant="flat"
                    startContent={<Icon icon="hugeicons:printer" />}
                    size="sm"
                    className="text-base"
                    onPress={() => {
                        window.print();
                    }}
                >
                    {msg("recovery-codes-print")}
                </Button>
                <Button
                    color="primary"
                    variant="flat"
                    startContent={<Icon icon="hugeicons:download-04" />}
                    size="sm"
                    className="text-base"
                    onPress={() => {
                        const blob = new Blob([recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString], {
                            type: "text/plain"
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "recovery-codes.txt";
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                >
                    {msg("recovery-codes-download")}
                </Button>
                <Button
                    color="primary"
                    variant="flat"
                    startContent={<Icon icon="hugeicons:copy-02" />}
                    size="sm"
                    className="text-base"
                    onPress={() => {
                        navigator.clipboard.writeText(recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString);
                    }}
                >
                    {msg("recovery-codes-copy")}
                </Button>
            </div>

            {/* confirmation checkbox */}
            <Checkbox
                name="kcRecoveryCodesConfirmationCheck"
                isSelected={isSaved}
                onValueChange={setIsSaved}
                size="sm"
                className="font-semibold ml-2"
            >
                {msg("recovery-codes-confirmation-message")}
            </Checkbox>

            <form action={kcContext.url.loginAction} className="flex flex-col" id="kc-recovery-codes-settings-form" method="post">
                <input type="hidden" name="generatedRecoveryAuthnCodes" value={recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString} />
                <input type="hidden" name="generatedAt" value={recoveryAuthnCodesConfigBean.generatedAt} />
                <input type="hidden" id="userLabel" name="userLabel" value={msgStr("recovery-codes-label-default")} />

                <Checkbox name="logout-sessions" value="on" defaultSelected size="sm" className="ml-2">
                    <span className="font-normal text-xs text-gray-500">{msg("logoutOtherSessions")}</span>
                </Checkbox>

                <div className="flex flex-row gap-2 mt-4">
                    {isAppInitiatedAction && (
                        <Button
                            className="flex-1"
                            name="cancel-aia"
                            type="submit"
                            value="true"
                            color="default"
                        >
                            {msg("recovery-codes-action-cancel")}
                        </Button>
                    )}
                    <Button
                        className="flex-1"
                        type="submit"
                        value={msgStr("recovery-codes-action-complete")}
                        color="primary"
                        isDisabled={!isSaved}
                        // variant={!isFormSubmittable ? "faded" : "solid"}
                    >
                        {msgStr("recovery-codes-action-complete")}
                    </Button>
                </div>
            </form>
        </Template>
    );
}

