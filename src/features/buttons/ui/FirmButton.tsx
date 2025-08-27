import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import {ButtonTypes} from '../model/ButtonTypes';

export default function FirmButton({type, action, title}:{type?: string, action:Function, title?: string}) {
    if(typeof type == 'undefined') {
        type = ButtonTypes.primary;
    }

    return <TouchableOpacity onPress={_ => action()} 
            style={[
                styles.button,
                type == ButtonTypes.primary ? styles.buttonprimary : styles.buttonsecondary
            ]}>

            <Text style={styles.buttonText}>{title}</Text>
          </TouchableOpacity>

}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#2e2e2e",
        padding: 10,
        borderRadius: 6,
        margin: 10,
    },
buttonprimary: {
    backgroundColor: "#4682B4",
},

buttonsecondary: {
    backgroundColor: "#999",
},

    buttonText: {
        color: "white",
        textAlign: "center",
    }
});