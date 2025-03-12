// import type { JSX } from "keycloakify/tools/JSX";
import { useEffect, Fragment, useState } from "react";
import { assert } from "keycloakify/tools/assert";
// import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import {
    useUserProfileForm,
    getButtonToDisplayForMultivaluedAttributeField,
    type FormAction,
    type FormFieldError
} from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { Attribute } from "keycloakify/login/KcContext";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { Icon } from "@iconify/react";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Button, ButtonGroup } from "@heroui/button";
import { Radio, RadioGroup } from "@heroui/radio";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
    const { kcContext, i18n, kcClsx, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField } = props;

    const { advancedMsg } = i18n;

    const {
        formState: { formFieldStates, isFormSubmittable },
        dispatchFormAction
    } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    const groupNameRef = { current: "" };

    return (
        <>
            {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
                return (
                    <Fragment key={attribute.name}>
                        <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} kcClsx={kcClsx} />
                        {BeforeField !== undefined && (
                            <>
                            FIXME: To Customize: UserProfileFormFields.tsx: BeforeField
                            <BeforeField
                                attribute={attribute}
                                dispatchFormAction={dispatchFormAction}
                                displayableErrors={displayableErrors}
                                valueOrValues={valueOrValues}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                            </>
                        )}
                        <div
                            className="flex flex-col"
                            style={{
                                display: attribute.name === "password-confirm" && !doMakeUserConfirmPassword ? "none" : undefined,
                            }}
                        >
                            {attribute.annotations.inputHelperTextBefore !== undefined && (
                                <span className="text-gray-400 text-xs pl-2" id={`form-help-text-before-${attribute.name}`} aria-live="polite">
                                    {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                                </span>
                            )}
                            <InputFieldByType
                                attribute={attribute}
                                valueOrValues={valueOrValues}
                                displayableErrors={displayableErrors}
                                dispatchFormAction={dispatchFormAction}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                            {attribute.annotations.inputHelperTextAfter !== undefined && (
                                <span className="text-gray-400 text-xs pl-2" aria-live="polite">
                                    {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                                </span>
                            )}
                        </div>
                            {AfterField !== undefined && (
                                <>
                                FIXME: To Customize: UserProfileFormFields.tsx: AfterField
                                <AfterField
                                    attribute={attribute}
                                    dispatchFormAction={dispatchFormAction}
                                    displayableErrors={displayableErrors}
                                    valueOrValues={valueOrValues}
                                    kcClsx={kcClsx}
                                    i18n={i18n}
                                />
                                </>
                            )}
                        {/* NOTE: Downloading of html5DataAnnotations scripts is done in the useUserProfileForm hook */}
                    </Fragment>
                );
            })}
        </>
    );
}

function GroupLabel(props: {
    attribute: Attribute;
    groupNameRef: {
        current: string;
    };
    i18n: I18n;
    kcClsx: KcClsx;
}) {
    const { attribute, groupNameRef, i18n } = props;

    const { advancedMsg } = i18n;

    if (attribute.group?.name !== groupNameRef.current) {
        groupNameRef.current = attribute.group?.name ?? "";

        if (groupNameRef.current !== "") {
            assert(attribute.group !== undefined);

            return (
                <div
                    className="flex flex-col"
                    {...Object.fromEntries(Object.entries(attribute.group.html5DataAnnotations).map(([key, value]) => [`data-${key}`, value]))}
                >
                    {(() => {
                        const groupDisplayHeader = attribute.group.displayHeader ?? "";
                        const groupHeaderText = groupDisplayHeader !== "" ? advancedMsg(groupDisplayHeader) : attribute.group.name;

                        return (
                            <label className="font-bold text-lg">
                                {groupHeaderText}
                            </label>
                        );
                    })()}
                    {(() => {
                        const groupDisplayDescription = attribute.group.displayDescription ?? "";

                        if (groupDisplayDescription !== "") {
                            const groupDescriptionText = advancedMsg(groupDisplayDescription);

                            return (
                                <label className="pl-8">
                                    {groupDescriptionText}
                                </label>
                            );
                        }

                        return null;
                    })()}
                </div>
            );
        }
    }

    return null;
}

type InputFieldByTypeProps = {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
    i18n: I18n;
    kcClsx: KcClsx;
};

function InputFieldByType(props: InputFieldByTypeProps) {
    const { attribute, valueOrValues } = props;

    switch (attribute.annotations.inputType) {
        case "textarea":
            return <TextareaTag {...props} />;
        case "select":
        case "multiselect":
            return <SelectTag {...props} />;
        case "select-radiobuttons":
        case "multiselect-checkboxes":
            return <InputTagSelects {...props} />;
        default: {
            console.log("InputFieldByType: attribute.annotations.inputType", attribute.annotations.inputType);
            if (valueOrValues instanceof Array) {
                return (
                    <>
                        {valueOrValues.map((...[, i]) => (
                            <InputTag key={i} {...props} fieldIndex={i} />
                        ))}
                    </>
                );
            }
            return <InputTag {...props} fieldIndex={undefined} />;
        }
    }
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
    const { attribute, fieldIndex, dispatchFormAction, valueOrValues, i18n, displayableErrors } = props;

    const { advancedMsgStr } = i18n;
    const [isPasswordRevealed, toggleIsPasswordRevealed] = useState(false);

    return (
        <>
            <Input
                name={attribute.name}
                label={advancedMsgStr(attribute.displayName ?? "")}
                isRequired={attribute.required}
                labelPlacement="outside"
                size="sm"
                // description={
                //     (attribute.annotations.inputHelperTextBefore !== undefined ||
                //         attribute.annotations.inputHelperTextAfter !== undefined) ? (
                //         <ul>
                //             {attribute.annotations.inputHelperTextBefore !== undefined && (
                //                 <li>{advancedMsg(attribute.annotations.inputHelperTextBefore)}</li>
                //             )}
                //             {attribute.annotations.inputHelperTextAfter !== undefined && (
                //                 <li>{advancedMsg(attribute.annotations.inputHelperTextAfter)}</li>
                //             )}
                //         </ul>
                //     ) : undefined
                // }
                aria-invalid={displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined}
                isInvalid={displayableErrors.length > 0}
                errorMessage={() => (
                    <ul aria-live="polite">
                        {displayableErrors.map(({ errorMessage }, i) => (
                            <li key={i}>{errorMessage}</li>
                        ))}
                    </ul>
                )}
                disabled={attribute.readOnly}

                type={(() => {
                    const { inputType } = attribute.annotations;

                    if (inputType?.startsWith("html5-")) {
                        return inputType.slice(6);
                    }
                    if ((attribute.name === "password" || attribute.name === "password-confirm") && !isPasswordRevealed) {
                        return "password";
                    }

                    return inputType ?? "text";
                })()}

                value={(() => {
                    if (fieldIndex !== undefined) {
                        assert(valueOrValues instanceof Array);
                        return valueOrValues[fieldIndex];
                    }

                    assert(typeof valueOrValues === "string");

                    return valueOrValues;
                })()}
                autoComplete={attribute.autocomplete}
                placeholder={
                    attribute.annotations.inputTypePlaceholder === undefined ? " " : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
                }
                pattern={attribute.annotations.inputTypePattern}
                // size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
                maxLength={
                    attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)
                }
                minLength={
                    attribute.annotations.inputTypeMinlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMinlength}`)
                }
                max={attribute.annotations.inputTypeMax}
                min={attribute.annotations.inputTypeMin}
                step={attribute.annotations.inputTypeStep}
                {...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))}
                onChange={event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: (() => {
                            if (fieldIndex !== undefined) {
                                assert(valueOrValues instanceof Array);

                                return valueOrValues.map((value, i) => {
                                    if (i === fieldIndex) {
                                        return event.target.value;
                                    }

                                    return value;
                                });
                            }

                            return event.target.value;
                        })()
                    })
                }
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: fieldIndex
                    })
                }
                endContent={
                    (attribute.name === "password" || attribute.name === "password-confirm") &&
                        <>
                            <Divider orientation="vertical" className="mr-2"/>
                            <Button
                                className="text-lg"
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="primary"
                                aria-label={advancedMsgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                                aria-controls={attribute.name}
                                onPress={() => {

                                    toggleIsPasswordRevealed(!isPasswordRevealed)
                                }}
                            >
                                {isPasswordRevealed ? <Icon icon="ri:eye-off-line" />: <Icon icon="ri:eye-line" />}
                            </Button>
                        </>}
            />
            {/* <input
                type={(() => {
                    const { inputType } = attribute.annotations;

                    if (inputType?.startsWith("html5-")) {
                        return inputType.slice(6);
                    }

                    return inputType ?? "text";
                })()}
                id={attribute.name}
                name={attribute.name}
                value={(() => {
                    if (fieldIndex !== undefined) {
                        assert(valueOrValues instanceof Array);
                        return valueOrValues[fieldIndex];
                    }

                    assert(typeof valueOrValues === "string");

                    return valueOrValues;
                })()}
                className={kcClsx("kcInputClass")}
                aria-invalid={displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined}
                disabled={attribute.readOnly}
                autoComplete={attribute.autocomplete}
                placeholder={
                    attribute.annotations.inputTypePlaceholder === undefined ? undefined : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
                }
                pattern={attribute.annotations.inputTypePattern}
                size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
                maxLength={
                    attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)
                }
                minLength={
                    attribute.annotations.inputTypeMinlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMinlength}`)
                }
                max={attribute.annotations.inputTypeMax}
                min={attribute.annotations.inputTypeMin}
                step={attribute.annotations.inputTypeStep}
                {...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))}
                onChange={event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: (() => {
                            if (fieldIndex !== undefined) {
                                assert(valueOrValues instanceof Array);

                                return valueOrValues.map((value, i) => {
                                    if (i === fieldIndex) {
                                        return event.target.value;
                                    }

                                    return value;
                                });
                            }

                            return event.target.value;
                        })()
                    })
                }
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: fieldIndex
                    })
                }
            /> */}
            {(() => {
                if (fieldIndex === undefined) {
                    return null;
                }

                assert(valueOrValues instanceof Array);

                const values = valueOrValues;

                return (
                    <>
                        {displayableErrors.length !== 0 &&
                            <ul aria-live="polite">
                                {displayableErrors.map(({ errorMessage }, i) => (
                                    <li key={i} className="text-sm text-danger">{errorMessage}</li>
                                ))}
                            </ul>
                        }
                        <AddRemoveButtonsMultiValuedAttribute
                            attribute={attribute}
                            values={values}
                            fieldIndex={fieldIndex}
                            dispatchFormAction={dispatchFormAction}
                            i18n={i18n}
                        />
                    </>
                );
            })()}
        </>
    );
}

function AddRemoveButtonsMultiValuedAttribute(props: {
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>;
    i18n: I18n;
}) {
    const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;

    const { msg } = i18n;

    const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({ attribute, values, fieldIndex });

    return (
        <ButtonGroup
            variant="faded"
            size="sm"
        >
            {hasRemove && (
                <Button
                    onPress={() =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: values.filter((_, i) => i !== fieldIndex)
                        })
                    }
                >
                    <Icon icon="mdi:bin" />
                    {msg("remove")}
                </Button>
            )}
            {(hasAdd && hasRemove) &&
                <Divider orientation="vertical" />
            }
            {hasAdd && (
                <Button
                    onPress={() =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: [...values, ""]
                        })
                    }
                >
                    <Icon icon="mdi:add" />
                    {msg("addValue")}
                </Button>
            )}
        </ButtonGroup>
    );
}

function InputTagSelects(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, i18n, valueOrValues, displayableErrors } = props;

    const options = (() => {
        walk: {
            const { inputOptionsFromValidation } = attribute.annotations;

            if (inputOptionsFromValidation === undefined) {
                break walk;
            }

            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

            if (validator === undefined) {
                break walk;
            }

            if (validator.options === undefined) {
                break walk;
            }

            return validator.options;
        }

        return attribute.validators.options?.options ?? [];
    })();

    return (
        (attribute.annotations.inputType === "select-radiobuttons" ? (
            <RadioGroup
                name={attribute.name}
                label={i18n.advancedMsg(attribute.displayName ?? "")}
                // placeholder="&nbsp;"
                value={typeof valueOrValues === "string" ? valueOrValues : undefined}

                isRequired={attribute.required}
                size="sm"
                isDisabled={attribute.readOnly}
                aria-invalid={displayableErrors.length !== 0}
                isInvalid={displayableErrors.length !== 0}
                errorMessage={() => (
                    <ul aria-live="polite">
                        {displayableErrors.map(({ errorMessage }, i) => (
                            <li key={i}>{errorMessage}</li>
                        ))}
                    </ul>
                )}
                onValueChange={value => {
                    try {
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: value
                        });
                    } catch (error) {
                        console.error(error);
                    } finally {
                        dispatchFormAction({
                            action: "focus lost",
                            name: attribute.name,
                            fieldIndex: undefined
                        })
                    }
                }}
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: undefined
                    })
                }
            >
                {options.map(option => (
                    <Radio value={option} key={option}>
                        {inputLabel(i18n, attribute, option)}
                    </Radio>
                ))}
            </RadioGroup>
        ) : (
            <CheckboxGroup
                name={attribute.name}
                label={i18n.advancedMsg(attribute.displayName ?? "")}
                // placeholder="&nbsp;"
                value={typeof valueOrValues === "string" ? [valueOrValues] : valueOrValues}

                isRequired={attribute.required}
                size="sm"
                isDisabled={attribute.readOnly}
                aria-invalid={displayableErrors.length !== 0}
                isInvalid={displayableErrors.length !== 0}
                errorMessage={() => (
                    <ul aria-live="polite">
                        {displayableErrors.map(({ errorMessage }, i) => (
                            <li key={i}>{errorMessage}</li>
                        ))}
                    </ul>
                )}
                onValueChange={value => {
                    try {
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: value
                        });
                    } catch (error) {
                        console.error(error);
                    } finally {
                        dispatchFormAction({
                            action: "focus lost",
                            name: attribute.name,
                            fieldIndex: undefined
                        })
                    }
                }}
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: undefined
                    })
                }
            >
                {options.map(option => (
                    <Checkbox value={option} key={option}>
                        {inputLabel(i18n, attribute, option)}
                    </Checkbox>
                ))}
            </CheckboxGroup>
        ))
    );
}

function TextareaTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues } = props;
    const { advancedMsg } = i18n;

    assert(typeof valueOrValues === "string");

    const value = valueOrValues;

    return (
        <Textarea
            name={attribute.name}
            label={advancedMsg(attribute.displayName ?? "")}
            labelPlacement="outside"
            // placeholder="&nbsp;"
            value={value}
            isRequired={attribute.required}
            // size="sm"

            disabled={attribute.readOnly}
            // cols={attribute.annotations.inputTypeCols === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeCols}`)}
            maxRows={attribute.annotations.inputTypeRows === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeRows}`)}
            maxLength={attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
            aria-invalid={displayableErrors.length !== 0}
            isInvalid={displayableErrors.length !== 0}
            errorMessage={() => (
                <ul aria-live="polite">
                    {displayableErrors.map(({ errorMessage }, i) => (
                        <li key={i}>{errorMessage}</li>
                    ))}
                </ul>
            )}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: event.target.value
                })
            }
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined
                })
            }
        />
    );
}

function SelectTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues } = props;

    const isMultiple = attribute.annotations.inputType === "multiselect";

    const options = (() => {
        walk: {
            const { inputOptionsFromValidation } = attribute.annotations;

            if (inputOptionsFromValidation === undefined) {
                break walk;
            }

            assert(typeof inputOptionsFromValidation === "string");

            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

            if (validator === undefined) {
                break walk;
            }

            if (validator.options === undefined) {
                break walk;
            }

            return validator.options;
        }

        return attribute.validators.options?.options ?? [];
    })();

    return (
        <Select
            name={attribute.name}
            label={i18n.advancedMsg(attribute.displayName ?? "")}
            labelPlacement="outside"
            // placeholder="&nbsp;"
            items={options.map(option => ({ value: option, label: inputLabel(i18n, attribute, option) }))}
            selectionMode={isMultiple ? "multiple" : "single"}
            // value={valueOrValues}
            selectedKeys={typeof valueOrValues === "string" ? [valueOrValues] : valueOrValues}
            renderValue={items => {
                return (
                    <div className="flex flex-wrap gap-2">
                        {items.map(item =>
                            isMultiple ? (
                                <Chip key={item.key} size="sm" variant="faded">
                                    <div className="flex items-center gap-2">
                                        <span>{item.data?.label}</span>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            radius="full"
                                            onPress={() => {
                                                try {
                                                    dispatchFormAction({
                                                        action: "update",
                                                        name: attribute.name,
                                                        valueOrValues: (() => {
                                                            return (typeof valueOrValues === "string" ? [valueOrValues] : valueOrValues).filter(
                                                                val => val !== item.key
                                                            );
                                                        })()
                                                    });
                                                } catch (e) {
                                                    console.error(e);
                                                } finally {
                                                    dispatchFormAction({
                                                        action: "focus lost",
                                                        name: attribute.name,
                                                        fieldIndex: undefined
                                                    });
                                                }
                                            }}
                                        >
                                            <Icon className="text-lg" icon="carbon:close-outline" />
                                        </Button>
                                    </div>
                                </Chip>
                            ) : (
                                <span key={item.key}>{item.textValue}</span>
                            )
                        )}
                    </div>
                );
            }}

            isRequired={attribute.required}
            size="sm"
            disabled={attribute.readOnly}
            aria-invalid={displayableErrors.length !== 0}
            isInvalid={displayableErrors.length !== 0}
            errorMessage={() => (
                <ul aria-live="polite">
                    {displayableErrors.map(({ errorMessage }, i) => (
                        <li key={i}>{errorMessage}</li>
                    ))}
                </ul>
            )}
            onSelectionChange={key => {
                try {
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: (() => {
                            const currentValue = key.currentKey ?? "";
                            if (isMultiple) {
                                const val = typeof valueOrValues === "string" ? [valueOrValues] : valueOrValues;
                                if (val.includes(currentValue)) {
                                    return val.filter(value => value !== currentValue);
                                }
                                return [...val, currentValue];
                            }
                            return currentValue;
                        })()
                    });
                } catch (e) {
                    console.error(e);
                } finally {
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: undefined
                    });
                }
            }}
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined
                })
            }
        >
            {item => (
                <SelectItem key={item.value} textValue={typeof item.value === "string" ? item.value : item.label.toString()}>
                    {item.label}
                </SelectItem>
            )}
        </Select>
    );
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
    const { advancedMsg } = i18n;

    if (attribute.annotations.inputOptionLabels !== undefined) {
        const { inputOptionLabels } = attribute.annotations;

        return advancedMsg(inputOptionLabels[option] ?? option);
    }

    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
        return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
    }

    return option;
}
