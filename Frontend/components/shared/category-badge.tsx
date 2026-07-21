import { Badge } from '@/components/ui/badge';

const CATEGORY_COLORS: Record<string, string> = {
  Fiction: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'Non-Fiction': 'bg-green-100 text-green-800 hover:bg-green-200',
  Science: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  Technology: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
  History: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  Mathematics: 'bg-red-100 text-red-800 hover:bg-red-200',
  Literature: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  Philosophy: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  Psychology: 'bg-teal-100 text-teal-800 hover:bg-teal-200',
  Economics: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  Art: 'bg-rose-100 text-rose-800 hover:bg-rose-200',
  Music: 'bg-violet-100 text-violet-800 hover:bg-violet-200',
  Comics: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  Biography: 'bg-lime-100 text-lime-800 hover:bg-lime-200',
  Self_Help: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
};

const DEFAULT_COLOR = 'bg-gray-100 text-gray-800 hover:bg-gray-200';

export function getCategoryColor(category: string | undefined): string {
  if (!category) return DEFAULT_COLOR;
  return CATEGORY_COLORS[category] || DEFAULT_COLOR;
}

export function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  return (
    <Badge className={getCategoryColor(category)} variant="secondary">
      {category}
    </Badge>
  );
}
