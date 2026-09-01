"use client";

import {
  useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory,
} from "@/hooks/useAdmin";
import { CategoryDialog } from "@/components/features/admin/CategoryDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";


export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Service Categories</h1>
        <CategoryDialog
          onSave={(name) => createMutation.mutate(name)}
          trigger={
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Category</Button>
          }
        />
      </div>

      {isLoading && <Skeleton className="h-48 w-full" />}

      {!isLoading && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <CategoryDialog
                    category={c}
                    onSave={(name) => updateMutation.mutate({ id: c.id, name })}
                    trigger={
                      <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                    }
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(c.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {categories?.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No categories yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}