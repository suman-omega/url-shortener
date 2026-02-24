import { useMemo, useState } from "react";

export interface UtmFormData {
  websiteUrl: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
}

export function useUtmGenerator() {
  const [formData, setFormData] = useState<UtmFormData>({
    websiteUrl: "",
    source: "",
    medium: "",
    campaign: "",
    content: "",
    term: "",
  });

  const generatedUrl = useMemo(() => {
    if (!formData.websiteUrl) return "";

    try {
      const url = new URL(
        formData.websiteUrl.startsWith("http")
          ? formData.websiteUrl
          : `https://${formData.websiteUrl}`,
      );

      if (formData.source) url.searchParams.set("utm_source", formData.source);
      if (formData.medium) url.searchParams.set("utm_medium", formData.medium);
      if (formData.campaign)
        url.searchParams.set("utm_campaign", formData.campaign);
      if (formData.content)
        url.searchParams.set("utm_content", formData.content);
      if (formData.term) url.searchParams.set("utm_term", formData.term);

      return url.toString();
    } catch {
      return "";
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      websiteUrl: "",
      source: "",
      medium: "",
      campaign: "",
      content: "",
      term: "",
    });
  };

  return {
    formData,
    generatedUrl,
    handleChange,
    resetForm,
  };
}
