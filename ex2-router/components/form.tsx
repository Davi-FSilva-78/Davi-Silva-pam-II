import * as React from 'react';
import { useForm, Controller} from 'react-hook-form';
import { Text, View, SafeAreaView, StyleSheet, TextInput  } from "react-native";
import NavButton from '../components/NavButton'
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useState, useEffect } from "react";
import firebase from 'firebase/app';
import{ getDocs, getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBH9c1JNyktUuTwn9D58byBU1zJwFXfpqQ",
  authDomain: "ex--routerdb.firebaseapp.com",
  projectId: "ex--routerdb"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const userCollectionRef = collection(db, "Usuários");
  


 

export default function Formulario ({tipo}) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getDocs(userCollectionRef);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Erro ao obter os documentos: ", error);
      }
    };

    getUsers();
  }, []); // Executa apenas uma vez ao montar o componente
    if(tipo == "Cadastro") {
        
        const schema = yup.object ({
            email: yup.string().email("email inválido").required("informe seu email"),
            senha: yup.string().required("digite sua senha")
        })
          
        const {control, handleSubmit, formState: {errors} } = useForm ({ /* é possível usar o defaultValues dentro de ({}) para colocar alguumas definições de valores*/
            resolver: yupResolver(schema),
        }) 
        
        async function handleSignIn(data){
          try{
            const {email, senha} = data;
            const user = await addDoc(userCollectionRef, {
              usEmail: email,
              usSenha: senha,
            });
            console.log("usuario cadastrado com id:", user.id)
          } catch(error){
            console.error("Erro ao cadastrar usuário", error)
          }
          
            
        }
        
        return (
            <View style={styles.container}>
                
                <Text style={styles.cadastroTiltle}>Cadastrar</Text>
                
                <Text >Email</Text>      
                <Controller //FAZER UM COMPONENTE CONTROLLER
                control={control} //user form => linha 9
                name="email" //nome do campo
                render={({ field: {onChange, onBlur, value} }) => ( //render = renderizar / passa também propriedaes dessa função criada
                    <TextInput
                    style={styles.input}
                    placeholder="   Digite seu Email"
                    onChangeText={onChange} //troca os use state por prop da renderização
                    onBlur={onBlur} //chamado quando o text input é trocado
                    value={value || ''} //troca valor de estado por valor de propriedade
                    keyboardType="email-address"
                    />
                )}
                />
                {errors.email && <Text style={styles.labelErrors}> {errors.email?.message} </Text>}
                
                <Text >Senha</Text>
                <Controller
                control={control} //user form => linha 9
                name="senha" //nome do campo
                render={({ field: {onChange, onBlur, value} }) => ( //render = renderizar / passa também propriedaes dessa função criada
                    <TextInput
                    style={styles.input}
                    placeholder="   Digite sua Senha"
                    onChangeText={onChange} //troca os use state por prop da renderização
                    onBlur={onBlur} //chamado quando o text input é trocado
                    value={value || ''} //troca valor de estado por valor de propriedade
                    keyboardType="default"
                    secureTextEntry={true}
                /> )}
                />
                {errors.senha && <Text style={styles.labelErrors}> {errors.senha?.message} </Text>}
        
        
                
                
                <View style={styles.btns}>
                
                    <NavButton
                        caminho={'/'}
                        label={'Cadastrar'}
                        style={styles.btnCadastro}
                        onPress={handleSubmit(handleSignIn)} //invés de mudança de estado chama esta função handleSign com status handleSubmit
                    />
            
                    <NavButton
                        onPress={()=>alert('Deseja retornar ao menu principal?')} 
                        caminho={'/'}
                        label={'Voltar'}
                    />
            




                 {/* <View>
                    <ul>
                      {users.map((user)=> {
                        return(
                          <div key={user.id}>
                          <li>{user.usEmail}</li>
                          </div>

                        );
    })}
                    </ul>
                  </View> código que mostra dados do banco*/}
                </View>
            </View>
            )

    } else if (tipo == "NovoCadastro") { 
        
    }
} 

const styles = StyleSheet.create({
    body: {
      flex: 1,
      
    },
    container:{
      flex: 1,
      alignItems: 'center',
      padding: 10,
      justifyContent: 'center'
    },
    input: {
      height:30,
      fontWeight: 'light',
      justifyContent: 'center',
      borderColor: '#023',
      borderStyle: "solid",
      backgroundColor:'#c7c7c7',
      width: 300,
      color:'#000',
      borderRadius: 10,
      marginLeft: 20,
    },
    btns:{
      padding: 50,
      flexDirection:'row',
      justifyContent: 'space-around',
      width: 480,
  
    },
    btnCadastro:{
      width: 30,
    },
    cadastroTiltle:{
      fontSize: 20,
    },
    labelErrors: {
      alignSelf: 'center',
      color: '#ff375b',
      margin: 8,
    }
   
  });
  