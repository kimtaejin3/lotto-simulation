import { notFound } from "next/navigation";
export const metadata = { robots: { index: false, follow: false } };
import { SharePreview } from "@/components/result/SharePreview";

/** Dev-only: renders both share-card variants so the design can be checked without a real run. */
export default function SharePreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <SharePreview />;
}
