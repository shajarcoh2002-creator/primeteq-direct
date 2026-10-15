import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Trade — Coming soon" };

export default function TradePage() {
  return (
    <ComingSoon
      section="Trade"
      title={
        <>
          Trade in. <span className="text-brand">Move up.</span>
        </>
      }
      body="Trading your device toward your next one is coming soon. For now, you can sell your device and see your offer."
    />
  );
}
