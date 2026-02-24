"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { useUtmGenerator } from "@/hooks/useUtmGenerator";
import { Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function UTMBuilder() {
  const { formData, generatedUrl, handleChange } = useUtmGenerator();
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("URL copied to clipboard!", { position: "top-center" });
    router.push("/links");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
          UTM Builder - Free Google URL Builder
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Fill all the required fields (marked with *) and other campaign
          information. A final URL with UTM codes will be automatically created.
          Copy the generated URL and use it in your campaigns.
        </p>
      </div>

      <Card className="border-none shadow-md bg-white">
        <CardContent className="pt-8 space-y-8">
          <FormField
            label="Website URL"
            id="websiteUrl"
            name="websiteUrl"
            placeholder="https://htrcare.com/windsor-ascot"
            value={formData.websiteUrl}
            onChange={handleChange}
            required
          />

          <FormField
            label="UTM Source"
            subLabel="(utm_source)"
            id="source"
            name="source"
            placeholder="private"
            value={formData.source}
            onChange={handleChange}
            helperText="e.g. newsletter, twitter, google, etc."
            required
          />

          <FormField
            label="UTM Medium"
            subLabel="(utm_medium)"
            id="medium"
            name="medium"
            placeholder="social"
            value={formData.medium}
            onChange={handleChange}
            helperText="e.g. email, social, cpc, etc."
            required
          />

          <FormField
            label="UTM Campaign"
            subLabel="(utm_campaign)"
            id="campaign"
            name="campaign"
            placeholder="organic"
            value={formData.campaign}
            onChange={handleChange}
            helperText="e.g. promotion, sale, etc."
            required
          />

          <FormField
            label="UTM Content"
            subLabel="(utm_content)"
            id="content"
            name="content"
            placeholder="carecosts"
            value={formData.content}
            onChange={handleChange}
            helperText="Any call-to-action or headline, e.g. buy-now."
          />

          <FormField
            label="UTM Term"
            subLabel="(utm_term)"
            id="term"
            name="term"
            placeholder="domiciliary-care"
            value={formData.term}
            onChange={handleChange}
            helperText="Keywords for your paid search campaigns"
          />

          {/* Generated URL Section */}
          <div className="pt-8 border-t border-slate-100">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">
                GENERATED UTM TRACKING URL
              </h3>
            </div>
            <div className="relative">
              <div className="min-h-[100px] w-full p-4 rounded-lg bg-indigo-50/50 border border-indigo-100 text-indigo-900 break-all font-mono text-sm leading-relaxed">
                {generatedUrl ||
                  "Fill in the Website URL to generate tracking link..."}
              </div>
              {generatedUrl && (
                <Button
                  onClick={handleCopy}
                  className="absolute bottom-3 right-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                  size="sm"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" /> Copy URL
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
