import { Modal, Alert, View, Text, Pressable, StyleSheet, Image } from "react-native";
import ModalData from "../../shared/types/ModalData";

export default function ModalView(
    {isModalVisible, setModalVisible, modalData}: {
        isModalVisible: boolean,
        setModalVisible: (visible:boolean) => void,
        modalData: ModalData})
    {
    return  <Modal
        animationType="none"//"slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
            //Alert.alert('Modal has been closed.');
            if(!!modalData.positiveButtonAction) {
                        modalData.positiveButtonAction();
                    }
                    else {
                        setModalVisible(false);
                    }
            }}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Pressable onPress={() => {
                    if(!!modalData.positiveButtonAction) {
                        modalData.positiveButtonAction();
                    }
                    else {
                        setModalVisible(false);
                    }
                }} 
                style={{position: "absolute", top: 20, right: 20}}>
                    <Image source={require("../../shared/assets/images/close.png")} style={{width:40, height:40}}/>
                </Pressable>
            <Text style={styles.modalText}>{modalData.title}</Text>
            <Text style={styles.modalText}>{modalData.message}</Text>

            {!!modalData.positiveButton && <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                    if(!!modalData.positiveButtonAction) {
                        modalData.positiveButtonAction();
                    }
                    else {
                        setModalVisible(false);
                    }
                }}>
                
            <Text style={styles.textStyle}>{modalData.positiveButton}</Text>
            </Pressable>}
            {!!modalData.negativeButton && <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                    if(!!modalData.negativeButtonAction) {
                        modalData.negativeButtonAction();
                    }
                    else {
                        setModalVisible(false);
                    }
                }}>  
            <Text style={styles.textStyle}>{modalData.negativeButton}</Text>
            </Pressable>}
        </View>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
