import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import MainScreen from './src/screens/MainScreen';
import LoginScreen from './src/screens/LoginScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DocumentUploadScreen from './src/screens/DocumentUploadScreen';
import ImageConfirmScreen from './src/screens/ImageConfirmScreen';
import SignupCompleteScreen from './src/screens/SignupCompleteScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'onboarding' | 'documentUpload' | 'imageConfirm' | 'signupComplete' | 'main'>('login');
  const [uploadedImageUri, setUploadedImageUri] = useState<string>('');

  const handleLogin = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('documentUpload');
  };

  const handleImageUploaded = (imageUri: string) => {
    setUploadedImageUri(imageUri);
    setCurrentScreen('imageConfirm');
  };

  const handleImageConfirm = () => {
    setCurrentScreen('signupComplete');
  };

  const handleSignupComplete = () => {
    setCurrentScreen('main');
  };

  const handleRetakeImage = () => {
    setCurrentScreen('documentUpload');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'onboarding':
        return <OnboardingScreen onContinue={handleOnboardingComplete} />;
      case 'documentUpload':
        return <DocumentUploadScreen onImageUploaded={handleImageUploaded} />;
      case 'imageConfirm':
        return (
          <ImageConfirmScreen 
            imageUri={uploadedImageUri}
            onConfirm={handleImageConfirm}
            onRetake={handleRetakeImage}
          />
        );
      case 'signupComplete':
        return <SignupCompleteScreen onComplete={handleSignupComplete} />;
      case 'main':
        return <MainScreen />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <>
      {renderCurrentScreen()}
      <StatusBar style="auto" />
    </>
  );
}
