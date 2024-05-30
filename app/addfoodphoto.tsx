import {
	Button,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	Image,
	TextInput,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { CameraView, CameraProps, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import CustomButton from "@/components/CustomButton";
import { ScrollView } from "react-native-gesture-handler";

interface PhotoInfo {
	uri: string;
	protein: number;
	carbs: number;
	fats: number;
	kcal: number;
	description: string;
	createdAt: number;
	[key: string]: any;
}

export default function AddFoodPhoto({ updatePhotos, setModalVisible }: any) {
	// broken on 51sdk: https://www.reddit.com/r/reactnative/comments/1cpx3zj/expo_sdk_51_camera/, downgraded
	const cameraRef = useRef<CameraView>(null);
	const [facing, setFacing] = useState<CameraProps["facing"]>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const [pictureSizes, setPictureSizes] = useState<string[]>([]);
	const [selectedSize, setSelectedSize] = useState(undefined);
	const [photoCaptured, setPhotoCaptured] = useState<boolean>(false);
	const [savedPhotoUri, setSavedPhotoUri] = useState<string | null>(null);
	const [protein, setProtein] = useState<string>("1");
	const [carbs, setCarbs] = useState<string>("1");
	const [fats, setFats] = useState<string>("1");
	const [description, setDescription] = useState<string>("Omletas");
	const [textInputFocused, setTextInputFocused] = useState<boolean>(false);

	useEffect(() => {
		async function getSizes() {
			console.log(permission);
			if (permission?.granted && cameraRef.current) {
				const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
				setPictureSizes(sizes);
				console.log(sizes);
			}
		}

		getSizes();
	}, [permission, cameraRef]);

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<View style={styles.container}>
				<Text style={{ textAlign: "center" }}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}

	// Handles photo capturing
	const capturePhoto = async () => {
		try {
			const photo = await cameraRef.current?.takePictureAsync();

			if (photo) {
				const fileUri =
					FileSystem.documentDirectory + `photos/Photo_${Date.now()}.jpg`;
				await FileSystem.makeDirectoryAsync(
					FileSystem.documentDirectory + "photos",
					{ intermediates: true }
				);

				await FileSystem.moveAsync({
					from: photo.uri,
					to: fileUri,
				});

				setSavedPhotoUri(fileUri);
			}

			setPhotoCaptured(true);
		} catch (error) {
			console.log("Error in capturing photo:", error);
		}
	};

	const processMetadata = async () => {
		try {
			if (savedPhotoUri) {
				const parsedProtein = parseFloat(protein);
				const parsedCarbs = parseFloat(carbs);
				const parsedFats = parseFloat(fats);
				const kcal = parsedProtein * 4 + parsedCarbs * 4 + parsedFats * 9;

				const photoInfo: PhotoInfo = {
					uri: savedPhotoUri,
					protein: parsedProtein,
					carbs: parsedCarbs,
					fats: parsedFats,
					kcal: kcal,
					description: description,
					createdAt: parseInt(savedPhotoUri.split("Photo_")[1]),
				};

				const jsonFileUri =
					FileSystem.documentDirectory +
					`photos/${savedPhotoUri.split("Photo_")[1]}.json`;
				await FileSystem.writeAsStringAsync(
					jsonFileUri,
					JSON.stringify(photoInfo)
				);

				updatePhotos();
				setModalVisible(false);
			}
		} catch (error) {
			console.log("Error saving photo metadata:", error);
		}
	};

	// Retake photo
	const retakePhoto = async () => {
		setPhotoCaptured(false);
	};

	// Switching camera
	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	const handleTextInputFocus = () => {
		setTextInputFocused(true);
	};

	const handleTextInputBlur = () => {
		setTextInputFocused(false);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	if (!photoCaptured) {
		return (
			<View style={styles.container}>
				<View style={{ flex: 1 }}>
					<CameraView
						style={styles.camera}
						facing={facing}
						ref={cameraRef}
						pictureSize={selectedSize}>
						<View style={styles.reverseButton}>
							<TouchableOpacity onPress={toggleCameraFacing}>
								<Ionicons name="camera-reverse-sharp" size={48} color="white" />
							</TouchableOpacity>
						</View>
						<View style={styles.photoButton}>
							<TouchableOpacity onPress={capturePhoto}>
								<Ionicons name="camera" size={48} color="white" />
							</TouchableOpacity>
						</View>
					</CameraView>
				</View>
			</View>
		);
	} else {
		return (
			<View style={styles.container}>
				<View>
					<TouchableOpacity style={styles.backArrow} onPress={closeModal}>
						<Ionicons name="arrow-back" size={48} color="black" />
					</TouchableOpacity>
				</View>
				<ScrollView style={{ height: Dimensions.get("window").height }}>
					{photoCaptured && savedPhotoUri && (
						<View style={{ flex: 1, alignSelf: "center", marginTop: 20 }}>
							<Image
								source={{ uri: savedPhotoUri }}
								style={{ width: 400, height: 400 }}
							/>
							<View style={styles.retakeContainer}>
								<TouchableOpacity
									style={styles.retakeButton}
									onPress={retakePhoto}>
									<Ionicons name="camera" size={48} color="black" />
									<Text> Retake</Text>
								</TouchableOpacity>
							</View>
							<TextInput
								placeholder="Protein (g)"
								keyboardType="numeric"
								onChangeText={(text) => setProtein(text)}
								value={protein}
								style={styles.macros}
								onFocus={handleTextInputFocus}
								onBlur={handleTextInputBlur}
							/>
							<TextInput
								placeholder="Carbs (g)"
								keyboardType="numeric"
								onChangeText={(text) => setCarbs(text)}
								value={carbs}
								style={styles.macros}
								onFocus={handleTextInputFocus}
								onBlur={handleTextInputBlur}
							/>
							<TextInput
								placeholder="Fats (g)"
								keyboardType="numeric"
								onChangeText={(text) => setFats(text)}
								value={fats}
								style={styles.macros}
								onFocus={handleTextInputFocus}
								onBlur={handleTextInputBlur}
							/>
							<TextInput
								placeholder="Omletas su varške"
								onChangeText={(text) => setDescription(text)}
								value={description}
								style={styles.macros}
								onFocus={handleTextInputFocus}
								onBlur={handleTextInputBlur}
							/>
						</View>
					)}
				</ScrollView>
				{!textInputFocused && (
					<View
						style={{
							position: "absolute",
							bottom: 30,
							width: Dimensions.get("window").width - 100,
							alignSelf: "center",
						}}>
						<CustomButton
							title="Add Photo"
							color="#ff8341"
							fontColor="#2c783f"
							onPress={processMetadata}
						/>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	camera: {
		flex: 1,
		height: Dimensions.get("window").height - 100,
	},
	retakeContainer: {
		flex: 0.4,
		flexDirection: "row",
		backgroundColor: "transparent",
		marginLeft: Dimensions.get("window").width - 100,
	},
	retakeButton: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	photoButton: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		alignItems: "flex-end",
		marginLeft: Dimensions.get("window").width / 2 - 24,
		marginBottom: 30,
	},
	reverseButton: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		marginLeft: Dimensions.get("window").width - 80,
		marginTop: 20,
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	macros: {
		marginLeft: 10,
		marginTop: 5,
		marginBottom: 5,
		fontSize: 16,
	},
	scroller: {
		width: Dimensions.get("window").width - 50,
		height: Dimensions.get("window").height - 200,
	},
	backArrow: {
		marginLeft: 10,
	},
});
