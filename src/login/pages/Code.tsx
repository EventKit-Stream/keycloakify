import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Alert } from "@heroui/alert";

export default function Code(props: PageProps<Extract<KcContext, { pageId: "code.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { code } = kcContext;

    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={code.success ? msg("codeSuccessTitle") : msg("codeErrorTitle", code.error)}
        >
            <div id="kc-code">
                {code.success ? (
                    <div className="flex flex-col gap-2 justify-center items-center">
                        <p>{msg("copyCodeInstruction")}</p>
                        <Alert
                            hideIcon
                            color="primary"
                            title={<p className="text-lg font-semibold tracking-widest -ml-2">{code.code}</p>}
                            variant="faded"
                            className="self-centre p-0 px-4 w-fit text-center text-base my-2"
                        />
                    </div>
                ) : (
                    code.error && (
                        <Alert
                            color="danger"
                            title={<p className="text-base" dangerouslySetInnerHTML={{__html:
                                kcSanitize(code.error)
                            }}></p>}
                            variant="faded"
                        />
                    )
                )}
            </div>
        </Template>
    );
}
