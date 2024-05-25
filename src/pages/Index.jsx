import React, { useState, useEffect, useRef } from "react";
import { Container, Button, VStack, Text, useToast } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const toast = useToast();

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          if (isRecording) {
            startRecording();
          } else if (mediaRecorderRef.current) {
            stopRecording();
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error",
        description: "Could not access the microphone.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  const handleKeyDown = (event) => {
    if (event.code === "Space") {
      setIsRecording(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.code === "Space") {
      setIsRecording(false);
    }
  };

  const uploadAudio = async (blob) => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const formData = new FormData();
    formData.append("file", blob, "audio.wav");

    try {
      const response = await fetch("https://api.google.com/gemini/v1/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast({
        title: "Error",
        description: "Could not upload the audio.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  const getTTS = async (text) => {
    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Error generating TTS:", error);
      toast({
        title: "Error",
        description: "Could not generate TTS.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleStop = async () => {
    if (audioBlob) {
      try {
        const response = await uploadAudio(audioBlob);
        const textResponse = response.text; // Assuming the response contains a text field
        getTTS(textResponse);
      } catch (error) {
        console.error("Error handling the response:", error);
      }
    }
  };

  useEffect(() => {
    if (audioBlob) {
      handleStop();
    }
  }, [audioBlob]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex="0">
      <VStack spacing={4}>
        <Text fontSize="2xl">Push-to-Talk Chat Interface</Text>
        <Button leftIcon={<FaMicrophone />} colorScheme={isRecording ? "red" : "blue"} onMouseDown={() => setIsRecording(true)} onMouseUp={() => setIsRecording(false)}>
          {isRecording ? "Recording..." : "Hold Spacebar to Record"}
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;
