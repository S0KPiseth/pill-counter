import BottomSheet from "@/components/bottonSheet";
import SparkOverlay from "@/components/sparkoverlay";
import TestOutput from "@/components/testOutput";
import VideoScreen from "@/components/video";
import { predict } from "@/utility/predict";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import { Animated, Button, Image, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const [showBs, setShowBs] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [predictionStatus, setPredictionStatus] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const apiURI = process.env.EXPO_PUBLIC_API_ENDPOINT;
  const apiKey = process.env.EXPO_PUBLIC_IMAGE_UPLOAD_API_KEY;
  const buttonSlide = useRef(new Animated.Value(0)).current;

  const handleUploadButton = async () => {
    const file = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
    });
    if (!file.canceled) {
      setCapturedImage(file.assets[0].uri);

      Animated.timing(buttonSlide, {
        toValue: 300,
        duration: 600,
        useNativeDriver: true,
      }).start();
      setProcessing(true);
      const res = await predict(file.assets[0].uri, apiKey, apiURI);
      setPredictionStatus(true);
      setProcessing(false);
      setPrediction(res.detections);
      setShowBs(true);
    }
  };

  const handleCameraButton = async () => {
    if (!showCamera) {
      setShowCamera(true);
      return;
    }

    if (showCamera && !capturedImage) {
      try {
        setPredictionStatus(false);
        setPrediction(null);
        const photo = await cameraRef.current?.takePictureAsync();
        setCapturedImage(photo.uri);
        Animated.timing(buttonSlide, {
          toValue: 300,
          duration: 600,
          useNativeDriver: true,
        }).start();
        setProcessing(true);
        const res = await predict(photo.uri, apiKey, apiURI);

        setPredictionStatus(true);
        setProcessing(false);

        setPrediction(res.detections);
        setShowBs(true);
      } catch (err) {
        console.log("Camera error:", err);
      }
    }
  };
  const handleClose = () => {
    setCapturedImage(null);
    setProcessing(false);
    setPredictionStatus(false);
    setShowBs(false);
    Animated.timing(buttonSlide, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };
  if (!permission) {
    return <View />;
  }

  if (permission === null) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Requesting permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // const pills = [
  //   {
  //     box: [175.11209106445312, 1175.9014892578125, 355.75537109375, 1267.65234375],
  //     class: "pill",
  //     confidence: 0.8151191473007202,
  //   },
  //   {
  //     box: [171.53860473632812, 1404.673828125, 374.0854797363281, 1488.5555419921875],
  //     class: "pill",
  //     confidence: 0.7743324041366577,
  //   },
  //   {
  //     box: [425.8067626953125, 1168.829345703125, 609.9223022460938, 1265.099609375],
  //     class: "pill",
  //     confidence: 0.7740919589996338,
  //   },
  //   {
  //     box: [427.65875244140625, 1061.657958984375, 607.1305541992188, 1151.42724609375],
  //     class: "pill",
  //     confidence: 0.7725139260292053,
  //   },
  //   {
  //     box: [173.60948181152344, 968.13720703125, 356.611572265625, 1050.9979248046875],
  //     class: "pill",
  //     confidence: 0.7666841149330139,
  //   },
  //   {
  //     box: [162.51443481445312, 862.338134765625, 352.38970947265625, 950.3800048828125],
  //     class: "pill",
  //     confidence: 0.754671573638916,
  //   },
  //   {
  //     box: [421.69683837890625, 750.8786010742188, 600.7974243164062, 856.3900146484375],
  //     class: "pill",
  //     confidence: 0.7282798290252686,
  //   },
  //   {
  //     box: [410.9881896972656, 1374.7899169921875, 669.8943481445312, 1500.64013671875],
  //     class: "pill",
  //     confidence: 0.7261420488357544,
  //   },
  //   {
  //     box: [182.841796875, 1072.2213134765625, 349.6171875, 1152.4046630859375],
  //     class: "pill",
  //     confidence: 0.7236350774765015,
  //   },
  //   {
  //     box: [159.0161590576172, 758.5419311523438, 351.5776062011719, 845.3509521484375],
  //     class: "pill",
  //     confidence: 0.7194682359695435,
  //   },
  //   {
  //     box: [424.037109375, 852.1505737304688, 612.8862915039062, 932.0951538085938],
  //     class: "pill",
  //     confidence: 0.7061280608177185,
  //   },
  //   {
  //     box: [179.48377990722656, 1287.4482421875, 363.50244140625, 1372.148193359375],
  //     class: "pill",
  //     confidence: 0.6808772683143616,
  //   },
  //   {
  //     box: [162.18310546875, 653.223876953125, 349.67578125, 743.8272094726562],
  //     class: "pill",
  //     confidence: 0.6672943234443665,
  //   },
  //   {
  //     box: [421.6607666015625, 641.1895751953125, 615.284912109375, 745.3540649414062],
  //     class: "pill",
  //     confidence: 0.5852102637290955,
  //   },
  // ];

  return (
    <View className="flex-1 bg-black">
      <View
        className="absolute top-16 left-5 z-40  rounded-full w-16 h-16 p-2 flex items-center justify-center"
        onTouchStart={() => {
          handleClose();
          setShowCamera(false);
        }}
      >
        <Image source={require("@/assets/images/logo.png")} className="w-20 h-20" resizeMode="contain"></Image>
      </View>
      {showCamera ? (
        capturedImage ? (
          <>
            <TouchableOpacity onPress={handleClose} className="absolute top-16 right-5 z-50 p-2 bg-white w-14 aspect-square rounded-full flex justify-center items-center">
              <Text className="text-black text-lg font-bold">X</Text>
            </TouchableOpacity>

            {predictionStatus ? <TestOutput imageUri={capturedImage} prediction={prediction} /> : <Image source={{ uri: capturedImage }} className="absolute top-0 left-0 w-full h-full" resizeMode="contain" />}
          </>
        ) : (
          <CameraView ref={cameraRef} facing={facing} style={{ flex: 1 }} />
        )
      ) : (
        <View className="flex-1 items-center justify-center bg-blue-300">
          <Text className="text-white text-xl">Welcome to the App</Text>
          <VideoScreen></VideoScreen>
        </View>
      )}

      {processing && (
        <>
          <SparkOverlay active={true} />
        </>
      )}

      <Animated.View
        style={{ transform: [{ translateY: buttonSlide }] }}
        className="absolute bottom-9 left-12 flex-row justify-between p-2.5 px-6 items-center z-30 bg-gray-300/20 rounded-full w-[80vw] bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-100
    "
      >
        <TouchableOpacity className="ctrBtn !w-20 !h-20">
          <Image source={require("@/assets/images/history.png")} className="w-10 h-10"></Image>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCameraButton} className="ctrBtn">
          <Image source={require("@/assets/images/camera.png")} className="w-full h-full"></Image>
        </TouchableOpacity>

        <TouchableOpacity className="ctrBtn !w-20 !h-20" onPress={handleUploadButton}>
          <Image source={require("@/assets/images/upload.png")} className="w-10 h-10"></Image>
        </TouchableOpacity>
      </Animated.View>
      {showBs && <BottomSheet prediction={prediction} />}
    </View>
  );
}
