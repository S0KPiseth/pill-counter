import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder, Text, TouchableWithoutFeedback, View } from "react-native";

const { height } = Dimensions.get("window");
type Prediction = {
  box: [number, number, number, number];
  class: string;
  confidence: number;
};

type BottomSheetProps = {
  prediction: Prediction[];
};

const BottomSheet: React.FC<BottomSheetProps> = ({ prediction }) => {
  console.log(prediction);
  let number = 0;
  prediction.forEach((e) => {
    if (e.class === "Pill") {
      number += 1;
    }
  });
  const sheetY = useRef(new Animated.Value(200)).current;
  const lastOffset = useRef(200);

  const overlayOpacity = sheetY.interpolate({
    inputRange: [0, 200],
    outputRange: [0.6, 0],
    extrapolate: "clamp",
  });

  const openSheet = () => {
    Animated.spring(sheetY, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
    lastOffset.current = 0;
  };

  const closeSheet = () => {
    Animated.spring(sheetY, {
      toValue: 200,
      useNativeDriver: false,
    }).start();
    lastOffset.current = 200;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gesture) => {
        const newY = lastOffset.current + gesture.dy;
        if (newY >= 0 && newY <= 200) sheetY.setValue(newY);
      },

      onPanResponderRelease: (_, gesture) => {
        lastOffset.current = lastOffset.current + gesture.dy;
        if (lastOffset.current > 100) {
          closeSheet();
        } else {
          openSheet();
        }
      },
    })
  ).current;

  return (
    <View className="absolute bottom-0 w-full h-full justify-end z-40">
      <TouchableWithoutFeedback
        onPress={() => {
          if (lastOffset.current === 0) closeSheet();
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            opacity: overlayOpacity,
          }}
        />
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => {
          if (lastOffset.current === 200) openSheet();
        }}
      >
        <Animated.View
          style={{
            height: 250,
            width: "100%",
            backgroundColor: "white",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            transform: [{ translateY: sheetY }],
          }}
        >
          <View {...panResponder.panHandlers} className="w-full items-center pt-3 absolute top-0">
            <View className="w-24 h-[4px] bg-black rounded-full" />
          </View>

          <View className="flex-1 justify-center items-center mt-6">
            <Text className="text-lg">Count</Text>
            <Text className="text-6xl font-semibold">{number}</Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default BottomSheet;
