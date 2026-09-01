// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   getAllUsers, updateUserStatus, getAllBookingsAdmin,
//   getCategories, createCategory, updateCategory, deleteCategory, UserStatus,
// } from "@/lib/api/admin";
// import { toast } from "sonner";

// export function useAllUsers() {
//   return useQuery({ queryKey: ["admin-users"], queryFn: getAllUsers });
// }

// export function useUpdateUserStatus() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
//       updateUserStatus(id, status),
//     onMutate: async ({ id, status }) => {
//       await qc.cancelQueries({ queryKey: ["admin-users"] });
//       const previous = qc.getQueryData(["admin-users"]);
//       qc.setQueryData(["admin-users"], (old) =>
//         old?.map((u) => (u.id === id ? { ...u, status } : u))
//       );
//       return { previous };
//     },
//     onError: (_e, _v, ctx) => {
//       if (ctx?.previous) qc.setQueryData(["admin-users"], ctx.previous);
//     },
//     onSuccess: (_data, { status }) => {
//       toast.success(status === "BANNED" ? "User banned" : "User unbanned");
//     },
//     onSettled: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
//   });
// }

// export function useAllBookingsAdmin() {
//   return useQuery({ queryKey: ["admin-bookings"], queryFn: getAllBookingsAdmin });
// }

// export function useAdminCategories() {
//   return useQuery({ queryKey: ["admin-categories"], queryFn: getCategories });
// }



// export function useCreateCategory() {
//   const qc = useQueryClient();

//   return useMutation({
//     mutationFn: createCategory,

//     onSuccess: () => {
//       toast.success("Category created successfully");
//       qc.invalidateQueries({ queryKey: ["admin-categories"] });
//     },

//     onError: (error) => {
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Failed to create category"
//       );
//     },
//   });
// }

// export function useUpdateCategory() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, name }: { id: string; name: string }) => updateCategory(id, name),
//     onSuccess: () => {
//       toast.success("Category updated");
//       qc.invalidateQueries({ queryKey: ["admin-categories"] });
//     },
//   });
// }

// export function useDeleteCategory() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: deleteCategory,
//     onSuccess: () => {
//       toast.success("Category deleted");
//       qc.invalidateQueries({ queryKey: ["admin-categories"] });
//     },
//   });
// }



import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAllUsers,
  updateUserStatus,
  getAllBookingsAdmin,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  UserStatus,
} from "@/lib/api/admin";

import { toast } from "sonner";

export function useAllUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await getAllUsers();
      return response.data;
    },
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: UserStatus;
    }) => updateUserStatus(id, status),

    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({
        queryKey: ["admin-users"],
      });

      const previous = qc.getQueryData([
        "admin-users",
      ]);

      qc.setQueryData(
        ["admin-users"],
        (old: Awaited<ReturnType<typeof getAllUsers>>["data"] | undefined) =>
          old?.map((user) =>
            user.id === id
              ? { ...user, status }
              : user
          )
      );

      return { previous };
    },

    onError: (error, _variables, context) => {
      if (context?.previous) {
        qc.setQueryData(
          ["admin-users"],
          context.previous
        );
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update user status"
      );
    },

    onSuccess: (_data, { status }) => {
      toast.success(
        status === "BANNED"
          ? "User banned"
          : "User unbanned"
      );
    },

    onSettled: () => {
      qc.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });
}

export function useAllBookingsAdmin() {
  return useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const response = await getAllBookingsAdmin();
      return response.data;
    },
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.data;
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      toast.success("Category created successfully");

      qc.invalidateQueries({
        queryKey: ["admin-categories"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create category"
      );
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      name,
    }: {
      id: string;
      name: string;
    }) => updateCategory(id, name),

    onSuccess: () => {
      toast.success("Category updated successfully");

      qc.invalidateQueries({
        queryKey: ["admin-categories"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update category"
      );
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: () => {
      toast.success("Category deleted successfully");

      qc.invalidateQueries({
        queryKey: ["admin-categories"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete category"
      );
    },
  });
}
