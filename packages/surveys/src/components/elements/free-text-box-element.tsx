import { useState } from "preact/hooks";
import { type TResponseData, type TResponseTtc } from "@formbricks/types/responses";
import { type TSurveyFreeTextBoxElement } from "@formbricks/types/surveys/elements";
import { Headline } from "@/components/general/headline";
import { Subheader } from "@/components/general/subheader";
import { getLocalizedValue } from "@/lib/i18n";
import { getUpdatedTtc, useTtc } from "@/lib/ttc";

interface FreeTextBoxElementProps {
  element: TSurveyFreeTextBoxElement;
  onChange: (responseData: TResponseData) => void;
  languageCode: string;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
  autoFocusEnabled: boolean;
  currentElementId: string;
}

export function FreeTextBoxElement({
  element,
  onChange,
  languageCode,
  ttc,
  setTtc,
  currentElementId,
}: Readonly<FreeTextBoxElementProps>) {
  const [startTime, setStartTime] = useState(performance.now());
  const isCurrent = element.id === currentElementId;
  useTtc(element.id, ttc, setTtc, startTime, setStartTime, isCurrent);

  const handleContinue = () => {
    const updatedTtcObj = getUpdatedTtc(ttc, element.id, performance.now() - startTime);
    setTtc(updatedTtcObj);
    onChange({ [element.id]: "skipped" });
  };

  return (
    <form
      key={element.id}
      onSubmit={(e) => {
        e.preventDefault();
        handleContinue();
      }}
      className="w-full">
      <div className="fb-flex fb-w-full fb-flex-col fb-items-center">
        {element.imageUrl && (
          <img
            src={element.imageUrl}
            alt=""
            className="fb-mb-4 fb-h-auto fb-max-h-[240px] fb-rounded-lg fb-object-contain"
          />
        )}
        {element.videoUrl && (
          <video
            src={element.videoUrl}
            className="fb-mb-4 fb-h-auto fb-max-h-[240px] fb-rounded-lg fb-object-contain"
            autoPlay
            loop
            muted
          />
        )}
        <Headline headline={getLocalizedValue(element.headline, languageCode)} alignTextCenter />
        <Subheader subheader={element.subheader ? getLocalizedValue(element.subheader, languageCode) : ""} />
        <button
          type="submit"
          className="fb-mt-4 fb-rounded-md fb-bg-slate-800 fb-px-6 fb-py-2 fb-text-sm fb-font-medium fb-text-white hover:fb-bg-slate-700 focus:fb-outline-none focus:fb-ring-2 focus:fb-ring-slate-500 focus:fb-ring-offset-2 dark:fb-bg-slate-200 dark:fb-text-slate-800 dark:hover:fb-bg-slate-300">
          {element.buttonLabel ? getLocalizedValue(element.buttonLabel, languageCode) : "Continue"}
        </button>
      </div>
    </form>
  );
}
