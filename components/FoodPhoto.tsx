import React from "react";
import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";

const logoUri = require("../assets/images/persikas-logo.png");

const FoodPhoto = ({ photoJson }: { photoJson: any }) => {
	return (
		<View style={styles.container}>
			<ImageBackground source={{ uri: photoJson.uri }} style={styles.image}>
				<View style={styles.overlayLogo}>
					<Image source={logoUri} style={styles.logo} />
				</View>
				<View style={styles.overlayDescription}>
					<Text style={styles.descriptionText}>{photoJson.description}</Text>
				</View>
				<View style={styles.overlayMacros}>
					<View style={styles.rowFlex}>
						<View style={styles.firstMacro}>
							<Text style={styles.macrosTitles}>Kalorijos</Text>
							<Text style={styles.macroText}>{photoJson.kcal} kcal</Text>
						</View>
						<View>
							<Text style={styles.macrosTitles}>Baltymai</Text>
							<Text style={styles.macroText}>{photoJson.protein}g</Text>
						</View>
						<View>
							<Text style={styles.macrosTitles}>Riebalai</Text>
							<Text style={styles.macroText}>{photoJson.fats}g</Text>
						</View>
						<View>
							<Text style={styles.macrosTitles}>Angliavandeniai</Text>
							<Text style={styles.macroText}>{photoJson.carbs}g</Text>
						</View>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 10,
		alignItems: "center",
	},
	image: {
		width: 400,
		height: 400,
	},
	overlayLogo: {
		position: "absolute",
		top: 20,
		right: 30,
	},
	logo: {
		width: 32,
		height: 32,
	},
	overlayDescription: {
		position: "absolute",
		bottom: 70,
		left: 20,
		marginHorizontal: 10,
	},
	descriptionText: {
		fontSize: 18,
		color: "#fff",
		fontWeight: "bold",
	},
	overlayMacros: {
		position: "absolute",
		bottom: 20,
		left: 20,
	},
	firstMacro: {
		marginLeft: 10,
	},
	macrosTitles: {
		marginRight: 30,
		fontSize: 12,
		color: "#fff",
	},
	macroText: {
		fontSize: 16,
		color: "#fff",
		fontWeight: "bold",
	},
	rowFlex: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
});

export default FoodPhoto;
