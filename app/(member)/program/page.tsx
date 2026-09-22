import { copy } from "@/lib/copy";
import { Empty } from "@/components/ui";

export default function ProgramIndex() {
  return (
    <div>
      <h1 className="font-display text-h1">{copy.program.title}</h1>
      <p className="mt-2 text-body text-muted">{copy.program.lead}</p>
      <div className="hairline my-8" />
      <Empty>{copy.program.pickLesson}</Empty>
    </div>
  );
}
