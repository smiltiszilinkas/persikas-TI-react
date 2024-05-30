import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

export default function About() {
	const navigation = useNavigation();
	const openDrawer = () => {
		navigation.dispatch(DrawerActions.openDrawer());
	};
	return (
		<View style={styles.container}>
			<View style={styles.imageRow}>
				<Ionicons
					name="menu"
					size={48}
					color="black"
					onPress={openDrawer}
					style={{ marginLeft: 20, marginTop: 50 }}
				/>
				<Text
					style={{
						marginTop: 50,
						fontSize: 32,
						fontWeight: "bold",
						marginLeft: 100,
					}}>
					About
				</Text>
				<Text></Text>
			</View>
			<View
				style={styles.separator}
				lightColor="#eee"
				darkColor="rgba(255,255,255,0.1)"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#E9E7E2",
		flex: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
	imageRow: {
		flexDirection: "row",
	},
});
