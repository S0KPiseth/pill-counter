import React from "react";
import { Image, Text, View } from "react-native";
interface Pill {
  box: [number, number, number, number]; // tuple of 4 numbers
  class: string;
  confidence: number;
}

interface OutputProps {
  imageUri: string;
  prediction: Pill;
}
function getCenterForFullScreen(box, origW, origH, screenW, screenH) {
  const [xmin, ymin, xmax, ymax] = box;

  const centerX = (xmin + xmax) / 2;
  const centerY = (ymin + ymax) / 2;

  const scaleX = screenW / origW;
  const scaleY = screenH / origH;

  const screenX = centerX * scaleX;
  const screenY = centerY * scaleY;

  const leftPercent = (screenX / screenW) * 100;
  const topPercent = (screenY / screenH) * 100;

  return {
    top: `${topPercent}%`,
    left: `${leftPercent}%`,
  };
}

const TestOutput = ({ imageUri, prediction }: OutputProps) => {
  return (
    <View className="w-full h-full relative" style={{ flex: 1 }}>
      <Image source={{ uri: imageUri }} className="absolute top-0 left-0 w-full h-full"></Image>
      {prediction.map((e, index) => {
        const pos = getCenterForFullScreen(e.box, 888, 1920, 390, 844);
        return (
          <Text
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: [{ translateX: -50 }, { translateY: -50 }],
            }}
            className="text-xl bg bg-white p-2 aspect-square w-10 rounded-full text-center border-2"
          >
            {index + 1}
          </Text>
        );
      })}
    </View>
  );
};

export default TestOutput;
