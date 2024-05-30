import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function TabLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Drawer initialRouteName="Home">
				<Drawer.Screen
					name="home"
					options={{
						headerShown: false,
						drawerLabel: "Home",
						title: "Home",
					}}></Drawer.Screen>
				<Drawer.Screen
					name="about"
					options={{
						headerShown: false,
						drawerLabel: "About",
						title: "About",
					}}></Drawer.Screen>
			</Drawer>
		</GestureHandlerRootView>
	);
}
