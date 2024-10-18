import { notifications } from "@mantine/notifications";

export const toast = {
  show: ({ title, message, color = "green" }) =>
    notifications.show({ title, message, color }),
  success: () =>
    notifications.show({
      title: "Enregistrement",
      message: "Enregistrement reussi",
      color: "green",
    }),
  error: () =>
    notifications.show({
      title: "Echec",
      message: "Echec d'enregistrement",
      color: "red",
    }),
};
