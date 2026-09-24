import { getSubmissions } from "@/lib/admin-data";
import { SubmissionsTable } from "@/components/admin/submissions-table";

export default async function AdminSubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <div>
      <h1 className="font-sans text-2xl font-semibold">Заявки с сайта</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Все обращения, отправленные через форму контактов.
      </p>

      <div className="mt-8">
        <SubmissionsTable submissions={submissions} />
      </div>
    </div>
  );
}
