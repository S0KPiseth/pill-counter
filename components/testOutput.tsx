import { getCenterOnContainedImage } from "@/utility/getCenter";
import { useImage } from "expo-image";
import React from "react";
import { Image, Text, View, useWindowDimensions } from "react-native";
interface Pill {
  box: [number, number, number, number];
  confidence: number;
}
interface OutputProps {
  imageUri: string;
  prediction: Pill;
}

const TestOutput = ({ imageUri, prediction }: OutputProps) => {
  const image = useImage(imageUri);
  const { width: screenW, height: screenH } = useWindowDimensions();

  if (!image?.width || !image?.height) return null;

  return (
    <View className="w-full h-full relative" style={{ flex: 1 }}>
      <Image source={{ uri: imageUri }} className="absolute top-0 left-0 w-full h-full" resizeMode="contain" />

      {prediction.map((e, index) => {
        const pos = getCenterOnContainedImage(e.box, image.width, image.height, screenW, screenH);

        return (
          <Text
            key={index}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: [{ translateX: -20 }, { translateY: -20 }],
            }}
            className="text-xl bg-white p-2 w-10 h-10 rounded-full text-center border-2"
          >
            {index + 1}
          </Text>
        );
      })}
    </View>
  );
};
export default TestOutput;
