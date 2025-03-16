import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";
import { Spacer } from "@heroui/spacer";
import { Alert } from "@heroui/alert";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";

export default function LoginConfigTotp(props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("loginTotpTitle")}
            displayMessage={!messagesPerField.existsError("totp", "userLabel")}
        >
            <div className="flex flex-col gap-4">
                <ol className="flex flex-col gap-1 list-decimal ml-4 text-sm">
                    <li>
                        <p>{msg("loginTotpStep1")}</p>

                        <ul className="flex flex-col gap-0 list-disc ml-4 text-sm">
                            {totp.supportedApplications.map(app => (
                                <li key={app}>{advancedMsg(app)}</li>
                            ))}
                        </ul>
                    </li>

                    {mode == "manual" ? (
                        <>
                            <li>
                                <p>{msg("loginTotpManualStep2")}</p>
                                <Alert
                                    hideIcon
                                    color="primary"
                                    title={totp.totpSecretEncoded}
                                    variant="faded"
                                    className="p-0 text-center my-2"
                                />
                                <Link className="text-sm" href={totp.qrUrl}>
                                    {msg("loginTotpScanBarcode")}
                                </Link>
                            </li>
                            <li>
                                <p>{msg("loginTotpManualStep3")}</p>
                                <ul className="list-disc ml-4">
                                    <li id="kc-totp-type">
                                        {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}
                                    </li>
                                    <li id="kc-totp-algorithm">
                                        {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                                    </li>
                                    <li id="kc-totp-digits">
                                        {msg("loginTotpDigits")}: {totp.policy.digits}
                                    </li>
                                    {totp.policy.type === "totp" ? (
                                        <li id="kc-totp-period">
                                            {msg("loginTotpInterval")}: {totp.policy.period}
                                        </li>
                                    ) : (
                                        <li id="kc-totp-counter">
                                            {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                                        </li>
                                    )}
                                </ul>
                            </li>
                        </>
                    ) : (
                        <li>
                            <p>{msg("loginTotpStep2")}</p>
                            <img
                                className="w-1/2 mt-2"
                                src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                                alt="Figure: Barcode"
                            />
                            <Spacer y={1} />
                            <Link className="text-sm" href={totp.manualUrl}>
                                {msg("loginTotpUnableToScan")}
                            </Link>
                        </li>
                    )}
                    <li>
                        <p>{msg("loginTotpStep3")}</p>
                        <p>{msg("loginTotpStep3DeviceName")}</p>
                    </li>
                </ol>

                <form action={url.loginAction} id="kc-totp-settings-form" method="post">
                    <Input
                        label={msg("authenticatorCode")}
                        isRequired
                        name="totp"
                        autoComplete="off"
                        aria-invalid={messagesPerField.existsError("totp")}
                        isInvalid={messagesPerField.existsError("totp")}
                        errorMessage={kcSanitize(messagesPerField.get("totp"))}
                        size="sm"
                        labelPlacement="outside"
                        aria-live="polite"
                    />
                    <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                    {mode && <input type="hidden" id="mode" value={mode} />}

                    <Input
                        label={msg("loginTotpDeviceName")}
                        isRequired={totp.otpCredentials.length >= 1}
                        name="userLabel"
                        autoComplete="off"
                        aria-invalid={messagesPerField.existsError("userLabel")}

                        isInvalid={messagesPerField.existsError("userLabel")}
                        errorMessage={kcSanitize(messagesPerField.get("userLabel"))}
                        size="sm"
                        labelPlacement="outside"
                        aria-live="polite"
                    />

                    <Checkbox name="logout-sessions" value="on" defaultSelected size="sm" className="ml-2 mt-2">
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
                                {msg("doCancel")}
                            </Button>
                        )}
                        <Button
                            className="flex-1"
                            type="submit"
                            value={msgStr("doSubmit")}
                            color="primary"
                            // variant={!isFormSubmittable ? "faded" : "solid"}
                        >
                            {msgStr("doSubmit")}
                        </Button>
                    </div>
                </form>
            </div>
        </Template>
    );
}
