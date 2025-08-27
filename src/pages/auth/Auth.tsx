import { useContext, useState } from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import FirmButton from '../../features/buttons/ui/FirmButton';
import { ButtonTypes } from '../../features/buttons/model/ButtonTypes';
import { AppContext } from '../../shared/context/AppContext';

export default function Auth() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const {user, showModal } = useContext(AppContext);

    const onEnterPress = () => {

        if(login.length == 0 ) {
          showModal({
            title: "Авторизація",
            message: "Введіть логін",
          });
          return;
        }
          if(password.length == 0 ) {
          showModal({
            title: "Авторизація",
            message: "Введіть пароль",
          });
          return;
        }
    };
    
    const isFormValid = () => login.length > 1 && password.length > 2;
  
  const anonView = () => {
  return (
      <View>
        <Text>Вхід до кабінету</Text>

        <View style={styles.textInputContainer}>
          <Text style={styles.textInputTitle}>Логін:</Text>
          <TextInput
            style={styles.textInput}
            value={login}
            onChangeText={setLogin}
          />
        </View>

        <View style={styles.textInputContainer}>
          <Text style={styles.textInputTitle}>Пароль:</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <FirmButton
          title="Вхід"
          type={isFormValid() ? ButtonTypes.primary : ButtonTypes.secondary}
          action={ onEnterPress}
        />
      </View>
    );
  };

  const userView = () => {
    return (
      <View>
        <Text>Ви вже увійшли як {typeof user === 'object' && user !== null && 'login' in user ? (user as any).login : user}</Text>
      </View>
    );
  };
   return user ? userView() : anonView();
};
const styles = StyleSheet.create({
  textInput: {
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 5,
    margin: 10,
    backgroundColor: "#494646ff",
  },
    textInputContainer: {
  borderColor: "#888",
  borderRadius: 6,
  margin: 10,
  backgroundColor: "#2e2e2e",
  },
  textInputTitle: {
    color: "white",
    marginLeft: 10,
    marginTop: 10,
  },

});
