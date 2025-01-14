import { AddNewCategory } from "./AddNewCategory";
import { CategoryTable } from "./CategoryTable";

export default function Page() {
  return (
    <div className="min-w-[900px] max-w-6xl space-y-20">
      <h1 className="text-2xl font-bold underline md:text-5xl">Category</h1>
      <div className="space-y-3">
        <AddNewCategory />
        <CategoryTable />
      </div>
    </div>
  );
}
