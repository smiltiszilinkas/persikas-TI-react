import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({
	title,
	onPress,
	color,
	fontColor,
}: {
	title: string;
	onPress: any;
	color: string;
	fontColor: string;
}) => {
	return (
		<TouchableOpacity
			style={[styles.button, { backgroundColor: color }]}
			onPress={onPress}>
			<Text style={[styles.buttonText, { color: fontColor }]}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "bold",
		alignSelf: "center",
	},
});

export default CustomButton;
