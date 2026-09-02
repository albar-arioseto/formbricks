"use client";

import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { TSurveyFreeTextBoxElement, type TSurveyElement } from "@formbricks/types/surveys/elements";
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
        localSurvey={localSurvey}
        element={element}
        elementIdx={elementIdx}
        updateElement={updateElement}
        isInvalid={isInvalid}
        locale={locale}
        isStorageConfigured={isStorageConfigured}
        headlineTranslations={{}}
        subheaderTranslations={{}}
      />

      <div className="mt-3">
        <ElementFormInput
          localSurvey={localSurvey}
          element={element}
          elementIdx={elementIdx}
          updateElement={(idx, attrs) => {
            // Map description to subheader for storage
            updateElement(idx, { subheader: attrs.headline });
          }}
          isInvalid={isInvalid}
          locale={locale}
          isStorageConfigured={isStorageConfigured}
          headlineTranslations={{}}
          subheaderTranslations={{}}
          field="subheader"
          label={t("common.description")}
          placeholder={t("templates.free_text_box_description_placeholder")}
        />
      </div>
    </form>
  );
};
