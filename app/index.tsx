import SparkOverlay from "@/components/sparkoverlay";
import TestOutput from "@/components/testOutput";
import axios from "axios";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { File } from "expo-file-system";
import React, { useRef, useState } from "react";
import { Animated, Button, Image, Text, TouchableOpacity, View } from "react-native";
export default function CameraScreen() {
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [predictionStatus, setPredictionStatus] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const apiURI = process.env.EXPO_PUBLIC_API_ENDPOINT;
  const apiKey = process.env.EXPO_PUBLIC_IMAGE_UPLOAD_API_KEY;
  const buttonSlide = useRef(new Animated.Value(0)).current;

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

        //request
        const file = new File(photo.uri);
        const base64 = file.base64Sync();

        const form = new FormData();
        form.append("file", base64);
        form.append("fileName", "hh");

        const options = {
          method: "POST",
          url: "https://upload.imagekit.io/api/v1/files/upload",
          headers: {
            "Content-Type": "multipart/form-data; boundary=---011000010111000001101001",
            Accept: "application/json",
            Authorization: `Basic ${apiKey}`,
          },
          data: form,
        };

        const { data } = await axios.request(options);
        axios
          .post(`${apiURI}/predict`, {
            url: data.url,
          })
          .then((res) => {
            console.log(res.data);
            setPredictionStatus(true);
            setProcessing(false);
            setPrediction(res.data.detections);
          })
          .catch((e) => console.log(e));
      } catch (err) {
        console.log("Camera error:", err);
      }
    }
  };
  const handleClose = () => {
    setCapturedImage(null);
    setProcessing(false);
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

  return (
    <View className="flex-1 bg-black">
      <View className="absolute top-16 left-5 z-40 bg-white rounded-full w-16 h-16 p-2 flex items-center justify-center  border-[3px] border-gray-500">
        <Image source={require("@/assets/images/logo.png")} className="w-14 h-14"></Image>
      </View>
      {showCamera ? (
        capturedImage ? (
          <>
            <TouchableOpacity onPress={handleClose} className="absolute top-10 right-10 z-30 p-2">
              <Text className="text-white text-lg font-bold">X</Text>
            </TouchableOpacity>

            {predictionStatus ? <TestOutput imageUri={capturedImage} prediction={prediction} /> : <Image source={{ uri: capturedImage }} className="absolute top-0 left-0 w-full h-full" />}
          </>
        ) : (
          <CameraView ref={cameraRef} facing={facing} style={{ flex: 1 }} />
        )
      ) : (
        <View className="flex-1 items-center justify-center bg-neutral-800">
          <Text className="text-white text-xl">Welcome to the App</Text>
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

        <TouchableOpacity className="ctrBtn !w-20 !h-20">
          <Image source={require("@/assets/images/upload.png")} className="w-10 h-10"></Image>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
