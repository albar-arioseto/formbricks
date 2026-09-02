"use client";

import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { type TSurveyElement, TSurveyFreeTextBoxElement } from "@formbricks/types/surveys/elements";
import { TSurvey } from "@formbricks/types/surveys/types";
import { TUserLocale } from "@formbricks/types/user";
import { ElementFormInput } from "@/modules/survey/components/element-form-input";

interface FreeTextBoxElementFormProps {
  localSurvey: TSurvey;
  element: TSurveyFreeTextBoxElement;
  elementIdx: number;
  updateElement: (elementIdx: number, updatedAttributes: Partial<TSurveyElement>) => void;
  lastElement: boolean;
  isInvalid: boolean;
  locale: TUserLocale;
  isStorageConfigured: boolean;
}

export const FreeTextBoxElementForm = ({
  element,
  elementIdx,
  updateElement,
  isInvalid,
  localSurvey,
  locale,
  isStorageConfigured = true,
}: FreeTextBoxElementFormProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <form>
      <ElementFormInput
        id="headline"
        value={element.headline}
        label={t("common.headline") + "*"}
        localSurvey={localSurvey}
        elementIdx={elementIdx}
        updateElement={updateElement}
        isInvalid={isInvalid}
        locale={locale}
        isStorageConfigured={isStorageConfigured}
      />

      <div className="mt-3">
        <ElementFormInput
          id="subheader"
          value={element.subheader}
          label={t("common.description")}
          localSurvey={localSurvey}
          elementIdx={elementIdx}
          updateElement={updateElement}
          isInvalid={isInvalid}
          locale={locale}
          isStorageConfigured={isStorageConfigured}
          placeholder={t("templates.free_text_box_description_placeholder")}
        />
      </div>

      <div className="mt-3">
        <ElementFormInput
          id="buttonLabel"
          value={element.buttonLabel}
          label={t("common.button_label")}
          localSurvey={localSurvey}
          elementIdx={elementIdx}
          updateElement={updateElement}
          isInvalid={isInvalid}
          locale={locale}
          isStorageConfigured={isStorageConfigured}
          placeholder="Continue"
        />
      </div>
    </form>
  );
};
