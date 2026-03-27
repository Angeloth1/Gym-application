import { StyleSheet } from "react-native";

export const colors = {
  background: "#f8f9fa",
  card: "#ffffff",
  text: "#111",
  textMuted: "#666",
  textLight: "#aaa",
  primary: "#007AFF",
  warning: "#F59E0B",
  success: "#28a745",
  danger: "#dc3545",
  inputBg: "#f8f9fa",
  inputBorder: "#e9ecef",
  inputLocked: "#e9ecef",
  stepperBg: "#e0eaff",
  border: "#eee",
  overlay: "rgba(0,0,0,0.5)",
};

export const globalStyles = StyleSheet.create({
  // Containers
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  // Cards & Badges
  floatingCard: {
    backgroundColor: colors.card,
    padding: 30,
    borderRadius: 24,
    alignItems: "center",
    width: "92%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  badge: {
    backgroundColor: colors.stepperBg,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 15,
  },
  badgeText: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
  },

  // Typography
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 20,
  },
  pageSubtitle: { fontSize: 16, color: colors.textMuted, marginTop: 10 },
  timerText: {
    fontSize: 72,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 20,
    fontVariant: ["tabular-nums"],
  },
  infoText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    marginTop: 6,
    fontStyle: "italic",
  },

  // Inputs & Steppers
  inputRow: { width: "100%", marginBottom: 25, gap: 15 },
  inputBox: { width: "100%" },
  inputLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
    textTransform: "uppercase",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepperBtn: {
    backgroundColor: colors.stepperBg,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperBtnText: { fontSize: 18, fontWeight: "bold", color: colors.primary },
  input: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
  inputLocked: {
    backgroundColor: colors.inputLocked,
    color: colors.textLight,
    borderColor: "#ddd",
  },

  // Buttons
  button: {
    paddingVertical: 18,
    width: "100%",
    borderRadius: 16,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: { color: "white", fontSize: 20, fontWeight: "bold" },
  textButton: { flexDirection: "row", alignItems: "center", padding: 5 },
  textButtonLabel: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  // FAB (Floating Action Button)
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },

  // Modals & Lists
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  listItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemTitle: { fontSize: 16, fontWeight: "600", color: colors.text },
  listItemSubtitle: { fontSize: 14, color: colors.textLight, marginTop: 4 },

  //Workout History StyleSheet
  historyCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  historyCardSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

