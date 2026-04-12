import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, SvgProps } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export interface LoaderProps extends SvgProps {
  color?: string;
  durationMs?: number;
}

export default function LoaderSvg({ color = "#FFFFFF", durationMs = 1500, ...props }: LoaderProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: durationMs,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation, durationMs]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <AnimatedSvg 
      preserveAspectRatio="none" 
      viewBox="0 0 32 32" 
      fill="none" 
      {...props}
      style={[props.style, { transform: [{ rotate: spin }] }]}
    >
      <Path fillRule="evenodd" clipRule="evenodd" d="M15.8333 22.5C17.6743 22.5 19.1667 23.9924 19.1667 25.8333V28.3333C19.1667 30.1743 17.6743 31.6667 15.8333 31.6667C13.9924 31.6667 12.5 30.1743 12.5 28.3333V25.8333C12.5 23.9924 13.9924 22.5 15.8333 22.5ZM11.1193 20.5474C12.421 21.8491 12.421 23.9597 11.1193 25.2614L9.35152 27.0292C8.04977 28.3309 5.93922 28.3309 4.63748 27.0292C3.33573 25.7274 3.33573 23.6169 4.63748 22.3151L6.40524 20.5474C7.70699 19.2456 9.81754 19.2456 11.1193 20.5474ZM25.2614 20.5474L27.0292 22.3151C28.3309 23.6169 28.3309 25.7274 27.0292 27.0292C25.7274 28.3309 23.6169 28.3309 22.3151 27.0292L20.5474 25.2614C19.2456 23.9597 19.2456 21.8491 20.5474 20.5474C21.8491 19.2456 23.9597 19.2456 25.2614 20.5474ZM28.3333 12.5C30.1743 12.5 31.6667 13.9924 31.6667 15.8333C31.6667 17.6743 30.1743 19.1667 28.3333 19.1667H25.8333C23.9924 19.1667 22.5 17.6743 22.5 15.8333C22.5 13.9924 23.9924 12.5 25.8333 12.5H28.3333ZM5.83333 12.5C7.67428 12.5 9.16667 13.9924 9.16667 15.8333C9.16667 17.6743 7.67428 19.1667 5.83333 19.1667H3.33333C1.49238 19.1667 -1.58946e-07 17.6743 -1.58946e-07 15.8333C-1.58946e-07 13.9924 1.49238 12.5 3.33333 12.5H5.83333ZM9.35152 4.63748L11.1193 6.40524C12.421 7.70699 12.421 9.81754 11.1193 11.1193C9.81754 12.421 7.70699 12.421 6.40524 11.1193L4.63748 9.35152C3.33573 8.04977 3.33573 5.93922 4.63748 4.63748C5.93922 3.33573 8.04977 3.33573 9.35152 4.63748ZM15.8333 -1.58946e-07C17.6743 -1.58946e-07 19.1667 1.49238 19.1667 3.33333V5.83333C19.1667 7.67428 17.6743 9.16667 15.8333 9.16667C13.9924 9.16667 12.5 7.67428 12.5 5.83333V3.33333C12.5 1.49238 13.9924 -1.58946e-07 15.8333 -1.58946e-07Z" fill={color}/>
    </AnimatedSvg>
  );
}
