import React, { useEffect, useState } from 'react'
import { View, Image, StyleSheet, Animated } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

interface CustomSplashScreenProps {
  onAnimationFinish: () => void
}

export function CustomSplashScreen({ onAnimationFinish }: CustomSplashScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(1))

  useEffect(() => {
    const showSplash = async () => {
      try {
        await SplashScreen.hideAsync()
      } catch (error) {
        console.warn('Splash screen hide failed:', error)
      }

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          onAnimationFinish()
        })
      }, 1000)
    }

    showSplash()
  }, [fadeAnim, onAnimationFinish])

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/images/splash.png')} style={styles.splashImage} resizeMode="contain" />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  splashImage: {
    width: 164,
    height: 56,
  },
})
