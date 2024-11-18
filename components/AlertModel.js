import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { widthDivided } from "./globalVariables";

/**
 * Alert component that displays a modal with a title, message, and action buttons.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.visible - Determines whether the modal is visible.
 * @param {string} props.title - The title text displayed in the modal.
 * @param {string} props.message - The message text displayed in the modal.
 * @param {function} props.onOk - The function to call when the Ok button is pressed.
 * @param {function} props.onCancel - The function to call when the Cancel button is pressed.
 * @param {string} [props.OkText="Ok"] - The text displayed on the Ok button.
 * @param {string} [props.cancelText=null] - The text displayed on the Cancel button. If null, the Cancel button is not displayed.
 * @returns {JSX.Element} The rendered Alert component made with Model.
 */
export default AlertModel = ({
  visible = false,
  title = "",
  message = "",
  onOk = () => {},
  onCancel = () => {},
  OkText = "Ok",
  cancelText = null,
}) => {
  return (
    <View style={{ position: "absolute", left: 0, top: 0 }}>
      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={onCancel}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
              {cancelText != null && (
                <Pressable
                  style={({ pressed }) => [
                    styles.cancelButton,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                  onPress={onCancel}
                >
                  <Text style={styles.buttonText}>{cancelText}</Text>
                </Pressable>
              )}
              <Pressable
                style={({ pressed }) => [
                  styles.okButton,
                  { opacity: pressed ? 0.5 : 1 },
                ]}
                onPress={onOk}
              >
                <Text style={styles.buttonText}>{OkText}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: widthDivided(1.3),
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    padding: 5,
    textAlign: "center",
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  okButton: {
    padding: 10,
    backgroundColor: "#6200ee",
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#f44336",
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
