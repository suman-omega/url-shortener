"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UTMBuilder() {
  const [formData, setFormData] = useState({
    websiteUrl: "",
    source: "",
    medium: "",
    campaign: "",
    content: "",
    term: "",
  });

  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (() => {
      if (!formData.websiteUrl) {
        setGeneratedUrl("");
        return;
      }

      try {
        const url = new URL(formData.websiteUrl);
        const params = new URLSearchParams();

        if (formData.source) params.append("utm_source", formData.source);
        if (formData.medium) params.append("utm_medium", formData.medium);
        if (formData.campaign) params.append("utm_campaign", formData.campaign);
        if (formData.content) params.append("utm_content", formData.content);
        if (formData.term) params.append("utm_term", formData.term);

        const queryString = params.toString();
        setGeneratedUrl(
          `${formData.websiteUrl}${formData.websiteUrl.includes("?") ? "&" : "?"}${queryString}`,
        );
      } catch {
        setGeneratedUrl("");
      }
    })();
  }, [formData]);

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("URL copied to clipboard!", { position: "top-center" });
    router.push("/links");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}

      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              UTM Builder - Free Google URL Builder
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Fill all the required fields (marked with *) and other campaign
              information. A final URL with UTM codes will be automatically
              created. Copy the generated URL and use it in your campaigns.
            </p>
          </div>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-8 space-y-8">
              {/* Website URL */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
                <div className="pt-2">
                  <Label htmlFor="websiteUrl" className="text-base font-medium">
                    Website URL <span className="text-red-500">*</span>
                  </Label>
                </div>
                <div className="space-y-1.5">
                  <Input
                    id="websiteUrl"
                    name="websiteUrl"
                    placeholder="https://htrcare.com/windsor-maidenhead-bracknell"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* UTM Source */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
                <div className="pt-2">
                  <Label htmlFor="source" className="text-base font-medium">
                    UTM Source <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-slate-400 mt-1">(utm_source)</p>
                </div>
                <div className="space-y-1.5">
                  <Input
                    id="source"
                    name="source"
                    placeholder="private"
                    value={formData.source}
                    onChange={handleChange}
                    className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-500 px-1 italic">
                    e.g. newsletter, twitter, google, etc.
                  </p>
                </div>
              </div>

              {/* UTM Medium */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
                <div className="pt-2">
                  <Label htmlFor="medium" className="text-base font-medium">
                    UTM Medium <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-slate-400 mt-1">(utm_medium)</p>
                </div>
                <div className="space-y-1.5">
                  <Input
                    id="medium"
                    name="medium"
                    placeholder="social"
                    value={formData.medium}
                    onChange={handleChange}
                    className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-500 px-1 italic">
                    e.g. email, social, cpc, etc.
                  </p>
                </div>
              </div>

              {/* UTM Campaign */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
                <div className="pt-2">
                  <Label htmlFor="campaign" className="text-base font-medium">
                    UTM Campaign <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-slate-400 mt-1">(utm_campaign)</p>
                </div>
                <div className="space-y-1.5">
                  <Input
                    id="campaign"
                    name="campaign"
                    placeholder="organic"
                    value={formData.campaign}
                    onChange={handleChange}
                    className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-500 px-1 italic">
                    e.g. promotion, sale, etc.
                  </p>
                </div>
              </div>

              {/* UTM Content */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
                <div className="pt-2">
                  <Label htmlFor="content" className="text-base font-medium">
                    UTM Content
                  </Label>
                  <p className="text-xs text-slate-400 mt-1">(utm_content)</p>
                </div>
                <div className="space-y-1.5">
                  <Input
                    id="content"
                    name="content"
                    placeholder="carecosts"
                    value={formData.content}
                    onChange={handleChange}
                    className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-500 px-1 italic">
                    Any call-to-action or headline, e.g. buy-now.
                  </p>
                </div>
              </div>

              {/* UTM Term */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
                <div className="pt-2">
                  <Label htmlFor="term" className="text-base font-medium">
                    UTM Term
                  </Label>
                  <p className="text-xs text-slate-400 mt-1">(utm_term)</p>
                </div>
                <div className="space-y-1.5">
                  <Input
                    id="term"
                    name="term"
                    placeholder="domiciliary-care"
                    value={formData.term}
                    onChange={handleChange}
                    className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-500 px-1 italic">
                    Keywords for your paid search campaigns
                  </p>
                </div>
              </div>

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
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-indigo-600 fill-indigo-600" />
              <span className="text-lg font-bold tracking-tight text-slate-900">
                HTR Care Go
              </span>
            </div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} HTR Care. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
