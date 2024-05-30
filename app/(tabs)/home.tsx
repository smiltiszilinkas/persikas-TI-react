import {
	View,
	StyleSheet,
	Text,
	Pressable,
	Dimensions,
	Modal,
} from "react-native";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import AddFoodPhoto from "../addfoodphoto";
import FoodPhoto from "@/components/FoodPhoto";

export default function HomeScreen() {
	new Date().getDate();
	const [photos, setPhotos] = useState<any>();
	const [modalVisible, setModalVisible] = useState(false);

	const navigation = useNavigation();
	const openDrawer = () => {
		navigation.dispatch(DrawerActions.openDrawer());
	};

	useEffect(() => {
		// Load the saved photo URI from the file system (if any)
		loadSavedPhotoUri();
	}, []);

	const loadSavedPhotoUri = async () => {
		try {
			const savedPhotosDirectory = FileSystem.documentDirectory + "photos/";
			const savedPhotos = await FileSystem.readDirectoryAsync(
				savedPhotosDirectory
			);

			if (savedPhotos.length > 0) {
				const jsonPhotos = [];
				for (const file of savedPhotos) {
					if (file.endsWith(".json")) {
						const fileUri = savedPhotosDirectory + file;
						const fileContent = await FileSystem.readAsStringAsync(fileUri);
						const json = JSON.parse(fileContent);
						jsonPhotos.push(json);
					}
				}

				// Check for JPEG files without corresponding JSON files
				for (const file of savedPhotos) {
					if (file.endsWith(".jpg")) {
						// Extract the file name without extension
						const fileNameWithoutExtension = file.slice(0, -4); // Remove the last 4 characters (".jpg")

						// Check if there's no JSON file for this JPEG file
						if (
							!jsonPhotos.find((json) =>
								json.uri.includes(fileNameWithoutExtension)
							)
						) {
							const jpegFileUri = savedPhotosDirectory + file;
							// Delete the JPEG file
							await FileSystem.deleteAsync(jpegFileUri, { idempotent: true });
							console.log(`Deleted JPEG file: ${jpegFileUri}`);
						}
					}
				}
				// Sort jsonPhotos by createdAt from latest to oldest
				jsonPhotos.sort((a, b) => b.createdAt - a.createdAt);

				setPhotos(jsonPhotos);
			}
		} catch (error) {
			console.error("Error reading saved photos", error);
		}
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
				<Text style={{ marginTop: 50, fontSize: 32, fontWeight: "bold" }}>
					Home
				</Text>
				<View style={{ marginTop: 50, marginRight: 20 }}>
					<Pressable
						onPress={() => {
							setModalVisible(true);
						}}>
						{({ pressed }) => (
							<Ionicons
								name="add"
								size={48}
								color={pressed ? "gray" : "black"}
							/>
						)}
					</Pressable>
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible}
						onRequestClose={() => {
							setModalVisible(false); // Close modal when user taps outside of it
						}}>
						<AddFoodPhoto
							updatePhotos={loadSavedPhotoUri}
							setModalVisible={setModalVisible}
						/>
					</Modal>
				</View>
			</View>

			<View style={styles.inputContainer}>
				<Text style={[styles.title, { borderColor: "#E9E7E2" }]}>
					Have a look at the recipes!
				</Text>
				<ScrollView style={styles.scroller}>
					{photos &&
						photos.length > 0 &&
						photos.map((photoJson: any, index: number) => {
							return <FoodPhoto key={index} photoJson={photoJson}></FoodPhoto>;
						})}
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#E9E7E2",
		flex: 1,
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		padding: 10,
		textAlign: "center",
		borderWidth: 1,
		borderColor: "#9CAA92",
	},
	greenBackground: {
		backgroundColor: "#9CAA92",
		alignItems: "center",
		width: 1000,
		height: 95,
		textAlign: "center",
		marginBottom: 20,
		marginTop: 20,
		justifyContent: "center",
	},
	greenBackgroundPerks: {
		backgroundColor: "#AFBBA7",
		alignItems: "center",
		width: 390,
		height: 100,
		textAlign: "center",
		marginBottom: 10,
		marginTop: 5,
		justifyContent: "center",
		borderRadius: 20,
	},
	opponentPart: {
		alignItems: "center",
		width: 200,
		height: 45,
		marginBottom: 20,
		marginTop: 20,
		justifyContent: "center",
	},
	subtitle: {
		fontSize: 22,
		fontWeight: "bold",
		padding: 10,
		textAlign: "center",
	},
	subSubtitle: {
		fontSize: 18,
		fontWeight: "bold",
		padding: 10,
		textAlign: "center",
		borderWidth: 1,
		borderColor: "#E9E7E9",
	},
	subSubSubtitle: {
		fontSize: 17,
		fontWeight: "bold",
		padding: 10,
		textAlign: "center",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
	question: {
		fontSize: 15,
		fontWeight: "bold",
		padding: 5,
		alignItems: "center",
		textAlign: "center",
	},
	questionOption: {
		margin: 5,
		borderWidth: 1,
		borderRadius: 10,
		overflow: "hidden",
		width: 200,
		alignItems: "center",
		textAlign: "center",
	},
	questionContainer: {
		backgroundColor: "#FFFFFF",
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
	linkText: {
		fontSize: 14,
		color: "#2e78b7",
	},
	textInput: {
		borderWidth: 1,
		borderColor: "black",
		width: 200,
		padding: 5,
		margin: 20,
		alignItems: "center",
	},
	inputContainer: {
		flexDirection: "column",
		alignItems: "center",
	},
	buttonContainer: {
		marginTop: 60,
		width: 150,
		borderRadius: 10,
		overflow: "hidden",
	},
	infoButton: {
		marginTop: 20,
		width: 32,
		height: 32,
		borderRadius: 30,
		overflow: "hidden",
		textAlignVertical: "center",
	},
	icon: {
		width: 40,
		height: 40,
		margin: 5,
	},
	smallImage: {
		margin: 2,
		marginBottom: 5,
		marginTop: 5,
	},
	image: {
		width: 100,
		height: 100,
		margin: 20,
	},
	avatar: {
		width: 100,
		height: 100,
		margin: 20,
		marginLeft: 20,
		borderRadius: 50,
		borderWidth: 6,
		borderColor: "#442E1F",
		marginTop: 0,
	},
	smallAvatar: {
		width: 80,
		height: 80,
		margin: 20,
		marginLeft: 20,
		borderRadius: 50,
		borderWidth: 6,
		borderColor: "#442E1F",
		marginTop: 0,
	},
	largeImage: {
		width: 200,
		height: 200,
		margin: 20,
	},
	imageRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	imageWrapper: {
		borderWidth: 1,
	},
	scroller: {
		width: Dimensions.get("window").width - 50,
		height: Dimensions.get("window").height - 200,
	},
	bottomMargin: {
		marginBottom: 160,
	},
});
