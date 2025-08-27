import React, {use, useContext, useEffect} from 'react';
import {StyleSheet, Text, Pressable, View} from 'react-native';
import { AppContext } from '../../shared/context/AppContext';

export default function Chat() {

  const {navigate, showModal, user} = useContext(AppContext);

    useEffect(() => { 
        if(user=== null) {
            showModal({
                title: "Комунікатор",
                message: "Доступ до чату можливий після авторизації",
                positiveButton: "Авторизуватися",
                positiveButtonAction: () => navigate("auth"),
                negativeButton: "Покинути чат",
                negativeButtonAction: () => navigate("-1")
            });
        }
    }, [user]);

    return <View>
        <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => showModal({
                title: "Комунікатор",
                message: "Доступ до чату можливий після авторизації",
                positiveButton: "Авторизуватися",
                positiveButtonAction: () => navigate("auth"),
                negativeButton: "Скасувати",
                negativeButtonAction: () => navigate("-1"),
                closeButtonAction: () => navigate("-1")
            }
        )}>
        <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable>
        </View>;
};
 
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