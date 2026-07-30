import type { ProjectTab } from "./types";
import { tabGuides } from "./createProjectConfig";

interface ProjectGuideProps {
  tab: ProjectTab;
}

export function ProjectGuide({ tab }: ProjectGuideProps) {
  const guide = tabGuides[tab];

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="font-semibold text-blue-900 mb-2">{guide.title}</h3>
      <ul className="text-sm text-blue-800 space-y-1">
        {guide.items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
