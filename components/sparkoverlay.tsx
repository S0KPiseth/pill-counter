import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, View } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Path to the uploaded spark image
const sparkImage = require("../assets/images/125-1256192_file-walmart-spark-svg-walmart-spark-png.png");

export default function SparkOverlay({ active }) {
  const sparks = Array.from({ length: 15 }).map(() => ({
    opacity: useRef(new Animated.Value(1)).current,
    rotate: useRef(new Animated.Value(0)).current,
    x: Math.random() * windowWidth,
    y: Math.random() * windowHeight,
  }));

  useEffect(() => {
    if (!active) return;

    sparks.forEach((spark) => {
      // Spin animation
      Animated.loop(
        Animated.timing(spark.rotate, {
          toValue: 1,
          duration: 2000 + Math.random() * 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Fade in/out animation
      const fade = () => {
        spark.opacity.setValue(0);
        Animated.sequence([
          Animated.timing(spark.opacity, {
            toValue: 1,
            duration: 500 + Math.random() * 500,
            useNativeDriver: true,
          }),
          Animated.timing(spark.opacity, {
            toValue: 0,
            duration: 500 + Math.random() * 500,
            useNativeDriver: true,
          }),
        ]).start(() => fade());
      };
      fade();
    });
  }, [active]);

  if (!active) return null;

  return (
    <View className="absolute top-0 left-0 w-full h-full z-20 bg-black/50">
      {sparks.map((spark, i) => {
        const spin = spark.rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        });

        return (
          <Animated.Image
            key={i}
            source={sparkImage}
            style={{
              position: "absolute",
              width: 20,
              height: 20,
              top: spark.y,
              left: spark.x,
              opacity: spark.opacity,
              transform: [{ rotate: spin }],
            }}
          />
        );
      })}
    </View>
  );
}
