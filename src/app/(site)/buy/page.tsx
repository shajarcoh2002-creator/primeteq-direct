import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Buy — Coming soon" };

export default function BuyPage() {
  return (
    <ComingSoon
      section="Buy"
      title={
        <>
          Shop tech from <span className="text-brand">Prime Teq</span>.
        </>
      }
      body="We’re getting this section ready. Soon you’ll be able to buy devices here."
    />
  );
}
