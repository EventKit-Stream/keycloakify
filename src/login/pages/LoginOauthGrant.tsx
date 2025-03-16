import { PageProps } from "keycloakify/login/pages/PageProps";
import { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

export default function LoginOauthGrant(props: PageProps<Extract<KcContext, { pageId: "login-oauth-grant.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { url, oauth, client } = kcContext;

    const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            bodyClassName="oauth"
            headerNode={
                <div className="flex flex-col items-center">
                    {client.attributes.logoUri &&
                        <img className="h-16 mt-4" src={client.attributes.logoUri} />
                    }
                    <p>{client.name ? msg("oauthGrantTitle", advancedMsgStr(client.name)) : msg("oauthGrantTitle", client.clientId)}</p>
                </div>
            }
        >
            <div className="flex flex-col gap-2">
                <h3>{msg("oauthGrantRequest")}</h3>
                <ul className="flex flex-col gap-1 list-disc list-inside">
                    {oauth.clientScopesRequested.map(clientScope => (
                        <li key={clientScope.consentScreenText}>
                            <span className="text-sm">
                                {advancedMsg(clientScope.consentScreenText)}
                                {clientScope.dynamicScopeParameter && (
                                    <>
                                        : <span className="font-semibold">{clientScope.dynamicScopeParameter}</span>
                                    </>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
                {(client.attributes.tosUri || client.attributes.policyUri) && (
                    <h3 className="flex flex-col gap-1">
                        <span className="text-base mb-2">
                            {client.name ? msg("oauthGrantInformation", advancedMsgStr(client.name)) : msg("oauthGrantInformation", client.clientId)}
                        </span>
                        <ul className="flex flex-col gap-1 list-disc list-inside">
                            {client.attributes.tosUri && (
                                <li className="text-sm">
                                    {msg("oauthGrantReview")}
                                    <Link className="text-sm" href={client.attributes.tosUri} target="_blank" rel="noopener noreferrer">
                                        {msg("oauthGrantTos")}
                                    </Link>
                                </li>
                            )}
                            {client.attributes.policyUri && (
                                <li className="text-sm">
                                    {msg("oauthGrantReview")}
                                    <Link className="text-sm" href={client.attributes.policyUri} target="_blank" rel="noopener noreferrer">
                                        {msg("oauthGrantPolicy")}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </h3>
                )}

                <form className="form-actions" action={url.oauthAction} method="POST">
                    <input type="hidden" name="code" value={oauth.code} />
                    <div className="flex flex-row justify-end gap-2">
                        {/* IDK what this is */}
                        {/* <div id="kc-form-options">
                            <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
                        </div> */}
                        <Button
                            color="danger"
                            name="cancel"
                            type="submit"
                            value={msgStr("doNo")}
                        >
                            {msgStr("doNo")}
                        </Button>
                        <Button
                            color="primary"
                            name="accept"
                            type="submit"
                            value={msgStr("doYes")}
                        >
                            {msgStr("doYes")}
                        </Button>
                    </div>
                </form>
            </div>
        </Template>
    );
}
