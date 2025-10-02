import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';

import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';


export default function Inicio() {

    const textColor = useThemeColor({}, "text");
    const backgroundColor = useThemeColor({}, "background");
    const tintColor = useThemeColor({}, "tint");
    const iconColor = useThemeColor({}, "icon");

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Image
                source={require("./../../assets/images/icon.png")}
                style={styles.image} />

            <Text style={[styles.title, { color: textColor }]}>Recycle</Text>
            
            <Text style={{ color: textColor }}>
                Ajudando com seu gerenciamento sempre!
            </Text>

            <Button
                style={[styles.button, { backgroundColor: iconColor }]}
                labelStyle={{ color: backgroundColor }}
                //onPress={() => router.push("/(auth)/login")}
                onPress={() => router.push("/(auth)/cadastroFuncionario")}
            >Começar</Button>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    image: {
        width: 150,
        height: 150
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
    },
    button: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 8,
        marginTop: 50,
        backgroundColor: "Black",
        padding: 4,
        borderRadius: 8,
    }
})